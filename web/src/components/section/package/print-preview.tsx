import { CheckCircle, Loader2, Printer, ThumbsUp, XCircle } from 'lucide-react'
import Constants from '../../../constants'
import { Button } from '../../ui/button'
import { Separator } from '../../ui/separator'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import { useAuth } from '@/providers/auth-provider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import logo from "../../../assets/logo.png"
import { RenderHeaderText } from '@/components/common/header'
import { IPackage } from '@/interfaces/package.interface'
import { format } from 'date-fns'
import { approvePackage } from '@/api/mutations/package.mutation'
import { formatCurrency } from '@/utils/currency.utils'

interface Props {
  data: IPackage
}

export default function PrintPreview({ data }: Props) {
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const { session: { user } } = useAuth();
  const { PermissionsCanApprove } = Constants;

  const { mutate: approveMutate, isPending: approving } = useMutation({
    mutationFn: async (id: string) => await approvePackage(id),
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['package-details'] })
      toast.success(data.message, {
        position: 'top-center',
        className: 'text-primary'
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'top-center',
        className: 'text-destructive'
      })
    },
  });

  return (
    <div className="w-full bg-white rounded-lg">
      <div className='h-[50px] px-4 flex items-center justify-between'>
        <h1 className='text-[12px] text-muted-foreground italic'>Print preview</h1>
        <div className='flex items-center gap-1'>
          {(!data?.approver && (user?.permission && PermissionsCanApprove.includes(user?.permission))) && (
            <Button
              size={'sm'}
              onClick={() => approveMutate(data?.id)}
              className='gap-1'
              disabled={approving}
            >
              {approving ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <ThumbsUp size={16} />
              )}
              <span>Approve</span>
            </Button>
          )}
          <Button
            onClick={() => reactToPrintFn()}
            size={'sm'}
            className='gap-1'
            disabled={data.approver ? false : true}
          >
            <Printer size={16} />
            <span>Print</span>
          </Button>
        </div>
      </div>
      <Separator />
      <div ref={contentRef} className="flex flex-col  p-4 space-y-4">
        <div>
          <div className='text-center text-black flex flex-col items-center'>
            <img src={logo} className='object-contain w-[220px] h-[150px] self-center' />
            {RenderHeaderText(data.officeBranch)}
          </div>

          <div className='p-2 text-muted-foreground space-y-4 mt-4'>
            <div className='flex items-center gap-4'>
              <div className='flex w-full items-end gap-1 text-[12px]'>
                <span className='leading-[16px] font-semibold text-nowrap'>
                  Package No.:
                </span>
                <div className='flex-1 border-b leading-[16px]'>
                  <span className='text-nowrap'>{data.packageNumber}</span>
                </div>
              </div>

              <div className='flex min-w-[300px] w-fit  items-end gap-1 text-[12px]'>
                <span className='leading-[16px] font-semibold text-nowrap'>
                  Date created:
                </span>
                <div className='flex-1 border-b leading-[16px]'>
                  <span className='text-nowrap'>
                    {format(new Date(data?.createdAt ?? new Date), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <h1 className='text-sm text-center font-medium uppercase bg-slate-100 py-1'>
            {data.name}
          </h1>

          <div className='space-y-1'>
            <h1 className='text-[12px] font-semibold'>Inclusions</h1>
            <div className='space-y-1 ml-4 text-muted-foreground'>
              {data.inclusions.map(item => (
                <div className='flex items-center text-[12px] gap-2'>
                  <CheckCircle size={16} color='#045C2B' />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-1'>
            <h1 className='text-[12px] font-semibold'>Accommodation</h1>
            <div className='space-y-1'>
              <table className="w-full table-auto border border-gray-300 text-[12px] text-muted-foreground">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-r border-gray-300 border-b">Hotel category</th>
                    <th className="px-4 py-2 border-r border-gray-300 border-b">Hotel options</th>
                    <th className="px-4 py-2 border-r border-gray-300 border-b">Rate per person</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.accommodations && data.accommodations?.length > 0) ? (
                    <>
                      {data.accommodations.map((item, index) => {
                        return (
                          <tr key={index} className='border'>
                            <td className="px-4 py-2 border-r border-gray-300 text-center">
                              {item.category}
                            </td>
                            <td className="px-4 py-2 border-r border-gray-300">
                              <ul className="list-disc list-inside marker:text-gray-500">
                                {item.options.map((option, index) => (
                                  <li key={index} className="list-item gap-1">
                                    {option}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="px-4 py-2 border-r border-gray-300 text-center">
                              {formatCurrency(item.currency, item.ratePerPerson)}
                            </td>
                          </tr>
                        )
                      })}
                    </>
                  ) : (
                    <tr className='h-[100px]'>
                      <td className="px-4 py-2 border-r border-gray-300 text-center"></td>
                      <td className="px-4 py-2 border-r border-gray-300 text-center"></td>
                      <td className="px-4 py-2 text-center"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className='space-y-1'>
            <h1 className='text-[12px] font-semibold'>Airfare</h1>
            <div className='space-y-1'>
              <table className="w-full table-auto border border-gray-300 text-[12px] text-muted-foreground">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-r border-gray-300 border-b">Airline</th>
                    <th className="px-4 py-2 border-r border-gray-300 border-b">Flight details</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.airfares && data.airfares?.length > 0) ? (
                    <>
                      {data.airfares.map((item, index) => {
                        return (
                          <tr key={index} className='border'>
                            <td className="px-4 py-2 border-r border-gray-300 text-center">
                              {item.airline}
                            </td>
                            <td className="px-4 py-2 border-r border-gray-300 text-center">
                              {item.flightDetails}
                            </td>
                          </tr>
                        )
                      })}
                    </>
                  ) : (
                    <tr className='h-[100px]'>
                      <td className="px-4 py-2 border-r border-gray-300 text-center"></td>
                      <td className="px-4 py-2 text-center"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className='space-y-1'>
            <h1 className='text-[12px] font-semibold'>Exclusions</h1>
            <div className='space-y-1 ml-4 text-muted-foreground'>
              {data.exclusions.map(item => (
                <div className='flex items-center text-[12px] gap-2'>
                  <XCircle size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-1'>
            <h1 className='text-[12px] font-semibold'>Remarks</h1>
            <div className='space-y-1 ml-4 text-[12px] text-muted-foreground'>
              <p>{data.remarks}</p>
            </div>
          </div>
        </div>

        <div className='flex items-end justify-evenly gap-4 text-muted-foreground mt-8 flex-3 pb-4'>
          <div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
            <div className='flex-1 border-b leading-[16px]'>
              {data.creator && (
                <div className='flex flex-col items-center'>
                  {data.creator.signature && (
                    <img
                      className='relative -bottom-2 h-[45px] object-contain'
                      src={data.creator.signature}
                      alt="signature"
                    />
                  )}
                  <span className='text-[12px] font-semibold uppercase'>
                    {`${data?.creator?.firstName} ${data?.creator?.lastName}`}
                  </span>
                </div>
              )}
            </div>
            <span className='leading-[16px]'>
              Prepared by
            </span>
          </div>
          <div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
            <div className='flex-1 border-b leading-[16px]'>
              {data.approver && (
                <div className='flex flex-col items-center'>
                  {data.approver.signature && (
                    <img
                      className='relative -bottom-2 h-[45px] object-contain'
                      src={data.approver.signature}
                      alt="signature"
                    />
                  )}
                  <span className='text-[12px] font-semibold uppercase'>
                    {`${data?.approver?.firstName} ${data?.approver?.lastName}`}
                  </span>
                </div>
              )}
            </div>
            <span className='leading-[16px]'>
              Approved & Reviewed by
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

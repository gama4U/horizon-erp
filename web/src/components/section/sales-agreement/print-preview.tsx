import { Loader2, Printer, ThumbsUp } from 'lucide-react'
import Constants from '../../../constants'
import { ISalesAgreement, TypeOfClient } from '../../../interfaces/sales-agreement.interface'
import { Button } from '../../ui/button'
import { Separator } from '../../ui/separator'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { useAuth } from '@/providers/auth-provider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { approveSalesAgreement } from '@/api/mutations/sales-agreement.mutation'
import { formatCurrency } from '@/utils/currency.utils'
import logo from "../../../assets/logo.png"
import SelectSalesAgreementTemplate, { SalesAgreementTemplateType } from '@/components/select/sales-agreement/print-template'
import { RenderHeaderText } from '@/components/common/header'
import { OfficeBranch } from '@/interfaces/user.interface'

interface Props {
  data: ISalesAgreement
}

export default function PrintPreview({ data }: Props) {
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const { session: { user } } = useAuth();
  const { PermissionsCanApprove } = Constants;
  const [selectedTemplate, setSelectedTemplate] = useState<SalesAgreementTemplateType>('template1');

  const { mutate: approveMutate, isPending: approving } = useMutation({
    mutationFn: async (id: string) => await approveSalesAgreement(id),
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['sales-agreement-details'] })
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

  const grandTotalUnitPrice = data.salesAgreementItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const grandTotalServiceFee = data.salesAgreementItems.reduce((acc, item) => acc + ((item.serviceFee ?? 0) * item.quantity), 0);
  const grandTotal = grandTotalUnitPrice + grandTotalServiceFee;
  const costOfSale = grandTotalUnitPrice;
  const netOfVat = grandTotalServiceFee / 1.12;
  const lessVAT = netOfVat * 0.12; // 12% of VAT Sales
  const totalDue = costOfSale + grandTotalServiceFee;
  const lessEWT = netOfVat * 0.02; // 2% of VAT Sales
  const totalAmountDue = totalDue - lessEWT;

  return (
    <div className="w-full bg-white rounded-lg">
      <div className='h-[50px] px-4 flex items-center justify-between'>
        <h1 className='text-[12px] text-muted-foreground italic'>Print preview</h1>
        <div className='flex items-center gap-1'>
          <SelectSalesAgreementTemplate
            value={selectedTemplate}
            onValueChange={(value) => setSelectedTemplate(value)}
          />
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
      <div ref={contentRef} className="flex flex-col min-h-[100vh] p-4 space-y-4 justify-between">
        <div>
          <div className='text-center text-black flex flex-col items-center'>
            <img src={logo} className='object-contain w-[220px] h-[150px] self-center' />
            {RenderHeaderText(data.client.officeBranch as OfficeBranch)}
          </div>
          <div className='p-2 text-muted-foreground space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='w-full flex items-end gap-1 text-[12px]'>
                <span className='leading-[16px] font-semibold'>
                  Client name:
                </span>
                <div className='flex-1 border-b leading-[16px]'>
                  <span>{data.client.name}  {(data.client.clientType === TypeOfClient.CORPORATE || data.client.clientType === TypeOfClient.GOVERNMENT) && `- ${data.client.department}`}</span>
                </div>
              </div>

              <div className='w-[200px] flex items-end gap-1 text-[12px]'>
                <span className='leading-[16px] font-semibold text-nowrap'>
                  Ser. No.:
                </span>
                <div className='flex-1 border-b leading-[16px]'>
                  <span className='text-nowrap'>{data.serialNumber}</span>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex w-full items-end gap-1 text-[12px]'>
                <span className='leading-[16px] font-semibold'>
                  Type of client:
                </span>
                <div className='flex-1 border-b leading-[16px]'>
                  <span>
                    {Constants.ClientTypesMap[data.client.clientType]}
                  </span>
                </div>
              </div>

            </div>
            <div className='flex text-[12px] gap-2'>
              <span className='leading-[16px] font-semibold'>
                P.O. Number:
              </span>
              <div className='flex-1 border-b leading-[16px]'>
                <span className='whitespace-normal'>
                  {data.purchaseRequestOrders
                    .map((order) => order.serialNumber)
                    .filter((serial) => serial)
                    .join(', ') || ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex-1'>
          <div className='flex justify-center mb-2'>
            <h1 className='text-muted-foreground text-[18px] font-semibold'>
              Sales Agreement
            </h1>
          </div>

          <table className="w-full table-auto border border-gray-300 text-[12px] text-muted-foreground">
            <thead>
              <tr>
                <th className="px-4 py-2 border-r border-gray-300 border-b">PARTICULARS</th>
                <th className="px-4 py-2 border-r border-gray-300 border-b">QTY.</th>
                <th className="px-4 py-2 border-r border-gray-300 border-b">UNIT PRICE</th>
                {selectedTemplate !== 'template1' && (
                  <th className="px-4 py-2 border-r border-gray-300 border-b">
                    SERVICE FEE
                  </th>
                )}
                <th className="px-4 py-2 border-b border-gray-300">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {(data.salesAgreementItems.length > 0) ? (
                <>
                  {data.salesAgreementItems.map((item, index) => {
                    const serviceFee = item.quantity * (item.serviceFee ?? 0);
                    const totalUnitPrice = item.unitPrice * item.quantity;
                    const total = totalUnitPrice + serviceFee;
                    return (
                      <tr key={index}>
                        <td className="px-4 py-2 border-r border-gray-300">
                          <ul className="list-disc ml-4">
                            {item.particulars.map(item => (
                              <li className='w-fit'>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-2 border-r border-gray-300 text-center">{item.quantity.toLocaleString()}</td>
                        <td className="px-4 py-2 border-r border-gray-300 text-center">
                          {selectedTemplate === 'template1' ? (
                            <>
                              {formatCurrency(data.currency, (item.unitPrice + (item.serviceFee ?? 0)))}
                            </>
                          ) : (
                            <>
                              {formatCurrency(data.currency, item.unitPrice)}
                            </>
                          )}
                        </td>
                        {selectedTemplate !== 'template1' && (
                          <td className="px-4 py-2 border-r border-gray-300 text-center">
                            {formatCurrency(data.currency, (item.serviceFee ?? 0))}
                          </td>
                        )}
                        <td className="px-4 py-2 text-center">
                          {formatCurrency(data.currency, total)}
                        </td>
                      </tr>
                    )
                  })}
                </>
              ) : (
                <tr className='h-[200px]'>
                  <td className="px-4 py-2 border-r border-gray-300 text-center"></td>
                  <td className="px-4 py-2 border-r border-gray-300 text-center"></td>
                  <td className="px-4 py-2 border-r border-gray-300 text-center"></td>
                  {selectedTemplate !== 'template1' && (
                    <td className="px-4 py-2 border-r border-gray-300 text-center"></td>
                  )}
                  <td className="px-4 py-2 text-center"></td>
                </tr>
              )}
            </tbody>
          </table>
          <div className='mt-2 text-[12px] text-muted-foreground border border-dashed p-2 space-y-1'>
            {selectedTemplate === 'template1' && (
              <>
                <div className='flex items-center justify-between'>
                  <h1>Grand total:</h1>
                  <span>{formatCurrency(data.currency, grandTotal)}</span>
                </div>
              </>
            )}
            {selectedTemplate === 'template2' && (
              <>
                <div className='flex items-center justify-between'>
                  <h1>Grand total:</h1>
                  <span>{formatCurrency(data.currency, grandTotal)}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Service fee: </h1>
                  <span>{formatCurrency(data.currency, grandTotalServiceFee)}</span>
                </div>
              </>
            )}
            {(selectedTemplate === 'template3') && (
              <>
                <div className='flex items-center justify-between'>
                  <h1>Coast of sale:</h1>
                  <span>{formatCurrency(data.currency, costOfSale)}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Service fee: </h1>
                  <span>{formatCurrency(data.currency, grandTotalServiceFee)}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Less(12% VAT): </h1>
                  <span>{`${formatCurrency(data.currency, lessVAT)}`}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Net of VAT: </h1>
                  <span>{`${formatCurrency(data.currency, netOfVat)}`}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Total Due: </h1>
                  <span>{`${formatCurrency(data.currency, totalDue)}`}</span>
                </div>
              </>
            )}
            {(selectedTemplate === 'template4') && (
              <>
                <div className='flex items-center justify-between'>
                  <h1>Coast of sale:</h1>
                  <span>{formatCurrency(data.currency, costOfSale)}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Service fee: </h1>
                  <span>{formatCurrency(data.currency, grandTotalServiceFee)}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Less(12% VAT): </h1>
                  <span>{`${formatCurrency(data.currency, lessVAT)}`}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Net of VAT: </h1>
                  <span>{`${formatCurrency(data.currency, netOfVat)}`}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Total Due: </h1>
                  <span>{`${formatCurrency(data.currency, totalDue)}`}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Less(EWT): </h1>
                  <span>{`${formatCurrency(data.currency, lessEWT)}`}</span>
                </div>
                <Separator className='bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <h1>Total Amount Due: </h1>
                  <span>{`${formatCurrency(data.currency, totalAmountDue)}`}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <div className='flex items-end justify-evenly gap-4 text-muted-foreground pb-4'>
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

          <div className='flex border p-2 flex-col  gap-4  text-[8px] text-muted-foreground'>
            <div className='flex flex-row justify-between gap-4'>
              <div className='w-1/2'>
                <p className='font-semibold mb-0'>Payment Terms:</p>
                <p className='text-left'>
                  Payments must be settled by the agreed-upon date. A 1% monthly charge will be applied to overdue balances, calculated for any fraction of a month past the due date.
                </p>
              </div>

              <div className='w-1/2'>
                <p className='font-semibold mb-0'>Cancellation Policy:</p>
                <p className='text-left'>
                  46 days or more before arrival: 100% refundable<br />
                  31-45 days before arrival: 50% refundable<br />
                  15-30 days before arrival: 80% refundable<br />
                  14 days or less before arrival: 100% non-refundable
                </p>
              </div>
            </div>
            <div className='w-full '>
              <p className='text-center'>
                Please note that these policies are subject to the cancellation terms of the principal supplier and may be negotiated or modified accordingly.
              </p>
            </div>
            <div className='w-full'>
              <p className='font-semibold mb-2 text-center'>Acknowledgement:</p>
              <p className='text-center'>
                By acknowledging this sales agreement, you confirm that all details provided are accurate and accepted.
              </p>
            </div>

            <div className='w-full text-[8px] space-y-0'>
              {data.client.officeBranch === OfficeBranch.CEBU && (
                <>
                  <h1 className='font-semibold mb-1'>
                    Cebu Branch Bank Information:
                  </h1>

                  <div className='flex border '>
                    <div className='flex-1 border-r flex flex-col gap-1 p-1'>
                      <div className='flex gap-2 items-center'>
                        <span>Bank name: </span>
                        <p className='font-semibold text-[10px]'>BDO - Banco De Oro</p>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <span>Account name: </span>
                        <p className='font-semibold text-[10px]'>HORIZON EXPRESS TRAVEL AND TOURS INC.</p>
                      </div>
                    </div>
                    <div className='w-fit min-w-[180px]'>
                      <div className='p-1 flex items-center gap-2'>
                        <h3 className='font-bold'>PHP account no.:</h3>
                        <span>0007-6802-1747</span>
                      </div>
                      <Separator orientation='horizontal' />
                      <div className='p-1 flex items-center gap-2'>
                        <h3 className='font-bold'>USD account no.:</h3>
                        <span>1007-6026-4937</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex border border-t-0'>
                    <div className='flex-1 border-r flex flex-col gap-1 p-1'>
                      <div className='flex gap-2 items-center'>
                        <span>Bank name: </span>
                        <p className='font-semibold text-[10px]'>PNB - Philippine National Bank</p>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <span>Account name: </span>
                        <p className='font-semibold text-[10px]'>HORIZON EXPRESS TRAVEL AND TOURS INC.</p>
                      </div>
                    </div>
                    <div className='w-fit min-w-[180px] flex items-center'>
                      <div className='p-1 flex items-center gap-2'>
                        <h3 className='font-bold'>PHP account no.:</h3>
                        <span>6361-1003-6035</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex border border-t-0'>
                    <div className='flex-1 border-r flex flex-col gap-1 p-1'>
                      <div className='flex gap-2 items-center'>
                        <span>Bank name: </span>
                        <p className='font-semibold text-[10px]'>GCASH</p>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <span>Account name: </span>
                        <p className='font-semibold text-[10px]'>HORIZON EXPRESS TRAVEL AND TOURS INC.</p>
                      </div>
                    </div>
                    <div className='w-fit min-w-[180px] flex items-center'>
                      <div className='p-1 flex items-center gap-2'>
                        <h3 className='font-bold'>Account no.:</h3>
                        <span>0995-013-2370</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {data.client.officeBranch === OfficeBranch.CALBAYOG && (
                <>
                  <h1 className='font-semibold mb-1'>
                    Calbayog Branch Bank Information:
                  </h1>

                  <div className='flex border border-b-0'>
                    <div className='flex-1 border-r flex flex-col gap-1 p-1'>
                      <div className='flex gap-2 items-center'>
                        <span>Bank name: </span>
                        <p className='font-semibold text-[10px]'>PNB - Philippine National Bank</p>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <span>Account name: </span>
                        <p className='font-semibold text-[10px]'>HORIZON EXPRESS TRAVEL AND TOURS INC.</p>
                      </div>
                    </div>
                    <div className='w-fit min-w-[180px]'>
                      <div className='p-1 flex items-center gap-2'>
                        <h3 className='font-bold'>PHP account no.:</h3>
                        <span>3129-7000-4640</span>
                      </div>
                      <Separator orientation='horizontal' />
                      <div className='p-1 flex items-center gap-2'>
                        <h3 className='font-bold'>USD Account No:</h3>
                        <span>3129-6007-7243</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex border'>
                    <div className='flex-1 border-r flex flex-col gap-1 p-1'>
                      <div className='flex gap-2 items-center'>
                        <span>Bank name: </span>
                        <p className='font-semibold text-[10px]'>GCASH</p>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <span>Account name: </span>
                        <p className='font-semibold text-[10px]'>HORIZON EXPRESS TRAVEL AND TOURS INC.</p>
                      </div>
                    </div>
                    <div className='w-fit min-w-[180px] flex items-center'>
                      <div className='p-1 flex items-center gap-2'>
                        <h3 className='font-bold'>Account no.:</h3>
                        <span>0995-013-2375</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

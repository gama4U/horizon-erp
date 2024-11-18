import AddSignatureDialog from "@/components/dialogs/profile/add-signature";
import { Separator } from "@/components/ui/separator";

interface Props {
  signature: string | null
}

export default function MySignature({signature}: Props) {
  return (
    <div className="border rounded-lg">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-[14px] font-semibold">
          My signature
        </h1>
        <AddSignatureDialog 
          action={!signature ? 'add' : 'change'}
        />
      </div>
      <Separator />
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        {signature ? (
          <img 
            className="object-contain"
            src={signature}
            alt="my-signature"
          />
        ) : (
          <span className="text-[12px] text-muted-foreground">
            No signature found
          </span>
        )}
      </div>
    </div>
  )
}

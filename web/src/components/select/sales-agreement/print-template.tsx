import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'

interface Props {
  value: SalesAgreementTemplateType;
  onValueChange: (value: SalesAgreementTemplateType) => void;
}

export type SalesAgreementTemplateType = 'template1' | 'template2' | 'template3' | 'template4';

export type SalesAgreementTemplate = {
  label: string;
  value: SalesAgreementTemplateType
}

const templates: SalesAgreementTemplate[] = [
  {
    label: 'Template 1',
    value: 'template1'
  },
  {
    label: 'Template 2',
    value: 'template2'
  },
  {
    label: 'Template 3',
    value: 'template3'
  },
  {
    label: 'Template 4',
    value: 'template4'
  },
]

export default function SelectSalesAgreementTemplate({value, onValueChange}: Props) {
  return (
    <Select onValueChange={onValueChange} value={value ?? 'all'}>
      <SelectTrigger className="w-fit min-w-[150px] h-[40px] py-0 gap-[12px] text-muted-foreground bg-slate-100 border-none text-[12px]">
        <SelectValue placeholder="Select a verified email to display" />
      </SelectTrigger>
      <SelectContent>
        {templates.map(({label, value}, index) => (
          <SelectItem
            key={index}
            value={value}
            className="text-[12px] text-muted-foreground"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

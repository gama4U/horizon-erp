import { ChangeEventHandler, HTMLInputTypeAttribute, HTMLProps, ReactNode, forwardRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';


interface Props {
	prefix?: ReactNode;
	postfix?: ReactNode;
	containerProps?: HTMLProps<HTMLDivElement>;
	inputProps?: HTMLProps<HTMLInputElement>;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	defaultValue?: any;
	placeholder?: string;
	type?: HTMLInputTypeAttribute
	max?: number
	searchBar?: boolean
	disabled?: boolean
}

const CommonInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
	const { prefix, postfix, searchBar, inputProps, containerProps, onChange, defaultValue, placeholder, type, max, disabled } = props;
	const [showPassword, setShowPassword] = useState(false)
	return (
		<div
			{...containerProps}
			className={`h-[40px] ${searchBar ? 'border-primary border-[0.5px]' : ''} px-[16px] w-full bg-slate-100 rounded-[4px] flex items-center gap-[14px] ${containerProps?.className}`}
		>
			{prefix}
			<Input
				max={max}
				ref={ref}
				disabled={disabled}
				onChange={onChange}
				defaultValue={defaultValue}
				placeholder={placeholder}
				type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
				{...inputProps}
				className={`flex-1 border-none shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-none h-fit px-1 text-[12px]  placeholder:text-[#888888] ${inputProps?.className}`}
			/>
			{type === 'password' &&
				<Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} type='button'>
					{!showPassword ?
						<Eye size={18} /> :
						<EyeOff size={18} />
					}
				</Button>
			}
			{postfix}
		</div>
	)
});

CommonInput.displayName = 'CommonInput';

export default CommonInput;

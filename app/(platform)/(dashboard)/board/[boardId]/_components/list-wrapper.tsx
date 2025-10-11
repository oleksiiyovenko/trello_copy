interface ListWrapperProps {
  children: React.ReactNode;
}

export function ListWrapper({ children }: ListWrapperProps) {
  return <li className='shrink-0 w-[272px] select-none'>{children}</li>;
}

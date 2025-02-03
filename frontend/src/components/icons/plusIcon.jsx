import Text from "../text/Text";

export default function PlusIcon ({className, onClick, text, textClassName, fill}) {
  return (
    <div className={className ? className : ''} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M17 3.66667C18.8383 3.66667 20.3333 5.16167 20.3333 7V17C20.3333 18.8383 18.8383 20.3333 17 20.3333H7C5.16167 20.3333 3.66667 18.8383 3.66667 17V7C3.66667 5.16167 5.16167 3.66667 7 3.66667H17ZM17 2H7C4.23833 2 2 4.23833 2 7V17C2 19.7617 4.23833 22 7 22H17C19.7617 22 22 19.7617 22 17V7C22 4.23833 19.7617 2 17 2ZM12 17C11.54 17 11.1667 16.6275 11.1667 16.1667V12.8333H7.83333C7.3725 12.8333 7 12.46 7 12C7 11.54 7.3725 11.1667 7.83333 11.1667H11.1667V7.83333C11.1667 7.37333 11.54 7 12 7C12.46 7 12.8333 7.37333 12.8333 7.83333V11.1667H16.1667C16.6267 11.1667 17 11.54 17 12C17 12.46 16.6267 12.8333 16.1667 12.8333H12.8333V16.1667C12.8333 16.6275 12.46 17 12 17Z" fill={`${fill || '#772A40'}`}/>
      </svg>
      {text &&
        <Text
          tag={'span'}
          className={textClassName}
          children={text}
        />
      }
    </div>
  )
}

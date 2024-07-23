import { Link } from "react-router-dom"

function Button({children,disabled,to,type,onclick}) {
        const base=`bg-yellow-400 uppercase font-semibold text-stone-800 text-sm
        inline-block tracking-wide rounded-full hover:bg-yellow-300 transition-colors duration-300
    focus:outline-none focus:ring focus:ring-yellow-300 focus:bg-yellow-300 
    focus:ring-offset-2 disabled:cursor-not-allowed `
        const style={
            primary:base + ' px-4 py-3 sm:px-6 sm:py-4',
            small:base + ' px-4 py-2 md:px-5 md:py-2.5 text-xs',
            round:base + 'px-2.5 py-1 md:px-3.5 md:py-2 text-sm',
            secondary:`border-2 border-stone-300 uppercase font-semibold text-stone-400 text-sm
            inline-block tracking-wide rounded-full hover:bg-stone-300 transition-colors duration-300
            focus:outline-none focus:ring focus:ring-stone-200 focus:bg-stone-300 hover:text-stone-800 
            focus:ring-offset-2 disabled:cursor-not-allowed px-4 py-2.5 sm:px-6 sm:py-3.5`,
        }
    if(to)return <Link to={to} className={style[type]}>{children}</Link>
    if(onclick) return (
        <button disabled={disabled} className={style[type]} onClick={onclick}>
            {children}
        </button>
    )

    return (
        <button disabled={disabled} className={style[type]} >
            {children}
        </button>
    )
}

export default Button

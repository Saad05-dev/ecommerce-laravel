export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <div 
            {...props} 
            className={`font-extrabold tracking-tight text-outline inline-block ${className}`}
            style={{
                WebkitTextStroke: '1px black',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1',
                paddingTop: '0.125rem',
                paddingBottom: '0.125rem'
            }}
        >
            <div className="text-2xl leading-tight uppercase">SAAD</div>
            <div className="text-2xl leading-tight uppercase">MEHDI</div>
        </div>
    );
}
export function Crosshair() {
    return (

        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 10,
        }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
                {/* Horizontal line */}
                <line x1="0" y1="12" x2="10" y2="12" stroke="white" strokeWidth="1.5" />
                <line x1="14" y1="12" x2="24" y2="12" stroke="white" strokeWidth="1.5" />
                {/* Vertical line */}
                <line x1="12" y1="0" x2="12" y2="10" stroke="white" strokeWidth="1.5" />
                <line x1="12" y1="14" x2="12" y2="24" stroke="white" strokeWidth="1.5" />
            </svg>
        </div>
    );

}
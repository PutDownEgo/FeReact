import React from 'react'

const LoadingSpinner = () => {
    return (
        <div id="spinner" className="show w-100 vh-100 bg-white position-fixed translate-middle top-50 start-50 d-flex align-items-center justify-content-center">
            <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden"></span>
            </div>
        </div>
    );
}

export default LoadingSpinner
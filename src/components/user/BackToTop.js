import React from 'react'

const BackToTop = () => {
    const handleToTop = () => {
        // Scroll to the top with a smooth animation
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
    return (
        <div className="container">

            <div id='backToTop' onClick={handleToTop}>
                <i className="fa-solid fa-angle-up"></i>
            </div>
        </div>
    )
}

export default BackToTop
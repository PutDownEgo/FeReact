import { useNavigate } from "react-router-dom";

function AccessDenied() {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5 text-center">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <i className="bi bi-exclamation-triangle display-1 text-secondary"></i>
                        <h1 className="display-1">403</h1>
                        <h1 className="mb-4">Access Denied</h1>
                        <p className="mb-4">You dont have permission to go this resource</p>
                        <a className="btn border-secondary rounded-pill py-3 px-5" onClick={handleGoBack}>Go Back To Home</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccessDenied
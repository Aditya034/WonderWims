import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// function TourCard({ tour, handleDelete, handleUpdate }) {
  function TourCard({ tour, handleDelete=null, handleUpdate=null }) {
  console.log({tour,handleUpdate,handleDelete})
    return (
        <div className="card mb-3" style={{ maxWidth: '700px' }}>
            <div 
                className="card-img-top" 
                style={{ backgroundImage: `url(${tour?.imageLink??""})`, height: '200px', backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
            <div className="card-body">
                <h5 className="card-title">{tour?.title ?? ""}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                    {tour?.duration?? ""} | {new Date(tour?.startDate ?? "").toLocaleDateString()}
                </h6>
                <p className="card-text">{tour?.description ?? ""}</p>
                <ul className="list-unstyled">
                    <li><strong>Price:</strong> ${tour?.price ?? ""}</li>
                    {/* Additional features can be listed here */}
                </ul>
                <ul>
                  {
                    (tour?.destinations ?? []).map(i=>{
                      return <li>{i?.destName}</li>
                    })
                  }
                </ul>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" onClick={() => handleUpdate(tour.tourId)}>Update</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(tour.tourId)}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default TourCard;

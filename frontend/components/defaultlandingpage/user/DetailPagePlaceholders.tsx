import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { MOCK_MATERIALS, MOCK_PLOTS, MOCK_PROFESSIONALS } from '../../../constants';

const DDetailPageLayout: React.FC<{title: string; children: React.ReactNode; backLink: string; backLinkText: string}> = ({ title, children, backLink, backLinkText }) => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
            <Link to={backLink} className="text-green-600 hover:text-green-800 hover:underline">
                &larr; {backLinkText}
            </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {children}
        </div>
    </div>
);

export const DPlotDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const plot = MOCK_PLOTS.find(p => p.id === id);

  if (!plot) {
    return <DDetailPageLayout title="Plot Not Found" backLink="/plots" backLinkText="Back to Plot Marketplace"><p>The plot you are looking for does not exist or has been removed.</p></DDetailPageLayout>;
  }

  return (
    <DDetailPageLayout title={plot.title} backLink="/plots" backLinkText="Back to Plot Marketplace">
        <img src={plot.imageUrl} alt={plot.title} className="w-full h-64 object-cover rounded-md mb-6" />
        <p className="text-gray-700 mb-2"><span className="font-semibold">Location:</span> {plot.location}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Price:</span> ₹{plot.price > 0 ? plot.price.toLocaleString('en-IN') : 'N/A (Book My SqFt)'}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Area:</span> {plot.area.toLocaleString('en-IN')} sqft</p>
        {plot.sqftPrice && <p className="text-gray-700 mb-2"><span className="font-semibold">Price per SqFt (for BMS):</span> ₹{plot.sqftPrice.toLocaleString('en-IN')}</p>}
        <p className="text-gray-700 mb-2"><span className="font-semibold">Type:</span> {plot.type} {plot.isFlagship && '(Flagship Plot)'}</p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Description</h3>
        <p className="text-gray-600 whitespace-pre-line mb-4">{plot.description}</p>
        {plot.amenities && plot.amenities.length > 0 && (
            <>
                <h3 className="text-xl font-semibold mt-4 mb-2">Amenities</h3>
                <ul className="list-disc list-inside text-gray-600">
                    {plot.amenities.map(amenity => <li key={amenity}>{amenity}</li>)}
                </ul>
            </>
        )}
         <div className="mt-6">
            <Button variant="primary">Contact Owner/Agent (Mock)</Button>
            {plot.sqftPrice && (
                 <Link to={`/book-my-sqft/${plot.id.includes('bms') ? 'bms-plot-alpha' : plot.id}`}>
                    <Button variant="secondary" className="ml-4">Book My SqFt</Button>
                </Link>
            )}
        </div>
    </DDetailPageLayout>
  );
};

export const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const material = MOCK_MATERIALS.find(m => m.id === id);

  const navigate = useNavigate(); // <-- useNavigate for navigation

  if (!material) {
    return <DDetailPageLayout title="Material Not Found" backLink="/materials" backLinkText="Back to Materials Store"><p>The material you are looking for does not exist.</p></DDetailPageLayout>;
  }
  return (
    <DDetailPageLayout title={material.name} backLink="/materials" backLinkText="Back to Materials Store">
        <img src={material.imageUrl} alt={material.name} className="w-full h-64 object-contain rounded-md mb-6 bg-gray-100 p-4" />
        <p className="text-gray-700 mb-2"><span className="font-semibold">Category:</span> {material.category}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Price:</span> ₹{material.price.toLocaleString('en-IN')}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Minimum Order Quantity (MOQ):</span> {material.moq}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Estimated Shipping Time:</span> {material.shippingTime}</p>
        <p className="text-gray-700 mb-4"><span className="font-semibold">Vendor:</span> {material.vendor}</p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Description</h3>
        <p className="text-gray-600 whitespace-pre-line mb-4">{material.description}</p>
        <div className="mt-6">
            <Button
              variant="primary"
              onClick={() => navigate(`/cart`)}
            >
              Add to Cart (Mock)
            </Button>
        </div>
    </DDetailPageLayout>
  );
};

export const DProfessionalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const professional = MOCK_PROFESSIONALS.find(p => p.id === id);
  const navigate = useNavigate();

  if (!professional) {
    return <DDetailPageLayout title="Professional Not Found" backLink="/services" backLinkText="Back to Services Hub"><p>The professional you are looking for does not exist.</p></DDetailPageLayout>;
  }
  return (
    <DDetailPageLayout title={professional.name} backLink="/services" backLinkText="Back to Services Hub">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <img
          src={professional.imageUrl}
          alt={professional.name}
          className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-green-200 mb-4 md:mb-0"
        />
        <div className="flex-grow">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs">{professional.service}</span>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">{professional.specialization}</span>
          </div>
          <p className="text-lg font-bold text-green-700 mb-1">{professional.name}</p>
          <p className="text-gray-700 mb-1"><span className="font-semibold">Rate:</span> {professional.rate}</p>
          <p className="text-yellow-600 mb-2"><span className="font-semibold">Rating:</span> {professional.rating}/5.0</p>
          <div className="flex gap-4 mt-4">
            <Button
              variant="primary"
              className="shadow-lg"
              onClick={() => navigate('/bookconsultation')}
            >
              Book Consultation
            </Button>
            <Button
              variant="outline"
              className="shadow-lg"
              onClick={() => navigate('/bookconsultation')}
            >
              Request Callback
            </Button>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mt-8 mb-2">Biography</h3>
      <p className="text-gray-600 whitespace-pre-line mb-4">{professional.bio}</p>
      {professional.portfolioImages && professional.portfolioImages.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mt-6 mb-2">Portfolio</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {professional.portfolioImages.map((img, idx) => (
              <img key={idx} src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-32 object-cover rounded-md shadow" />
            ))}
          </div>
        </>
      )}
      {!professional.portfolioImages && <p className="text-gray-500">Portfolio images coming soon.</p>}
    </DDetailPageLayout>
  );
};

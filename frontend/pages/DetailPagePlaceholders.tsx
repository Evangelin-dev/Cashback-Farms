
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PLOTS, MOCK_MATERIALS, MOCK_PROFESSIONALS } from '../constants';
import Button from '../components/common/Button';

const DetailPageLayout: React.FC<{title: string; children: React.ReactNode; backLink: string; backLinkText: string}> = ({ title, children, backLink, backLinkText }) => (
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

export const PlotDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const plot = MOCK_PLOTS.find(p => p.id === id);

  if (!plot) {
    return <DetailPageLayout title="Plot Not Found" backLink="/plots" backLinkText="Back to Plot Marketplace"><p>The plot you are looking for does not exist or has been removed.</p></DetailPageLayout>;
  }

  return (
    <DetailPageLayout title={plot.title} backLink="/plots" backLinkText="Back to Plot Marketplace">
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
    </DetailPageLayout>
  );
};

export const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const material = MOCK_MATERIALS.find(m => m.id === id);

  if (!material) {
    return <DetailPageLayout title="Material Not Found" backLink="/materials" backLinkText="Back to Materials Store"><p>The material you are looking for does not exist.</p></DetailPageLayout>;
  }
  return (
    <DetailPageLayout title={material.name} backLink="/materials" backLinkText="Back to Materials Store">
        <img src={material.imageUrl} alt={material.name} className="w-full h-64 object-contain rounded-md mb-6 bg-gray-100 p-4" />
        <p className="text-gray-700 mb-2"><span className="font-semibold">Category:</span> {material.category}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Price:</span> ₹{material.price.toLocaleString('en-IN')}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Minimum Order Quantity (MOQ):</span> {material.moq}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Estimated Shipping Time:</span> {material.shippingTime}</p>
        <p className="text-gray-700 mb-4"><span className="font-semibold">Vendor:</span> {material.vendor}</p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Description</h3>
        <p className="text-gray-600 whitespace-pre-line mb-4">{material.description}</p>
        <div className="mt-6">
            <Button variant="primary">Add to Cart (Mock)</Button>
        </div>
    </DetailPageLayout>
  );
};

export const ProfessionalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const professional = MOCK_PROFESSIONALS.find(p => p.id === id);

  if (!professional) {
     return <DetailPageLayout title="Professional Not Found" backLink="/services" backLinkText="Back to Services Hub"><p>The professional you are looking for does not exist.</p></DetailPageLayout>;
  }
  return (
    <DetailPageLayout title={professional.name} backLink="/services" backLinkText="Back to Services Hub">
        <div className="flex flex-col md:flex-row gap-6">
            <img src={professional.imageUrl} alt={professional.name} className="w-full md:w-1/3 h-auto object-cover rounded-md mb-6 md:mb-0" />
            <div className="flex-grow">
                <p className="text-gray-700 mb-2"><span className="font-semibold">Service:</span> {professional.service}</p>
                <p className="text-gray-700 mb-2"><span className="font-semibold">Specialization:</span> {professional.specialization}</p>
                <p className="text-gray-700 mb-2"><span className="font-semibold">Rate:</span> {professional.rate}</p>
                <p className="text-gray-700 mb-4"><span className="font-semibold">Rating:</span> {professional.rating}/5.0</p>
            </div>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-2">Biography</h3>
        <p className="text-gray-600 whitespace-pre-line mb-4">{professional.bio}</p>
        
        {professional.portfolioImages && professional.portfolioImages.length > 0 && (
            <>
                <h3 className="text-xl font-semibold mt-6 mb-2">Portfolio</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {professional.portfolioImages.map((img, idx) => (
                        <img key={idx} src={img} alt={`Portfolio ${idx+1}`} className="w-full h-32 object-cover rounded-md" />
                    ))}
                </div>
            </>
        )}
        {!professional.portfolioImages && <p className="text-gray-500">Portfolio images coming soon.</p>}

        <div className="mt-8">
            <Button variant="primary">Book Consultation (Mock)</Button>
            <Button variant="outline" className="ml-4">Request Callback (Mock)</Button>
        </div>
    </DetailPageLayout>
  );
};
    
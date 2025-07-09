// TestimonialSection.jsx
import React, { useState } from "react";

const testimonials = [
  {
    id: "A",
    rating: 5,
    text: "An amazing app ! The kind of data and scans it provides is matchless for an investor as well as a trader. I just love to browse through its various data points seamlessly . It is very reasonably priced too...",
    author: "Anu",
    date: "January 29, 2022",
  },
  {
    id: "B",
    rating: 5,
    text: "Excellent platform for stock analysis. The technical indicators are very accurate and help me make informed decisions.",
    author: "Rahul",
    date: "March 15, 2022",
  },
  {
    id: "C",
    rating: 5,
    text: "Best investment tool I've ever used. The charts are crystal clear and the data is always up-to-date.",
    author: "Priya",
    date: "August 8, 2022",
  },
  {
    id: "D",
    rating: 5,
    text: 'Wonderful App. Very Accurate Data & All ratios calculations from most recent last 12 month Values (TTM). Very Good representation in graphics, Most Apps only provide 5yr Data but Stockedge gives 10yr complete Data. Under "Learn" Wonderful videos are attached...',
    author: "DR ABDUL KALEEM BAHADUR",
    date: "December 30, 2021",
  },
];

const TestimonialSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 2;
  const pageCount = Math.ceil(testimonials.length / testimonialsPerPage);

  const displayedTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mb-0">
      <div className="border rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl md:text-2xl font-semibold text-center">
            What our Users are Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {displayedTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border-b md:border-b-0 pb-4 md:pb-0 md:pr-4"
            >
              <div className="flex text-yellow-400 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 mb-3">{testimonial.text}</p>

              <div className="flex items-center">
                <div className="mr-4 font-bold text-xl">{testimonial.id}</div>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">
                    <span>PlayStore</span> | <span>{testimonial.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pb-6">
          {[...Array(pageCount)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`mx-1 w-2 h-2 rounded-full ${
                currentPage === index ? "bg-blue-500" : "bg-gray-300"
              }`}
              aria-label={`Page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;

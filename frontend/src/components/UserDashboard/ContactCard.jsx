import { Phone, Mail, User } from "lucide-react";

export default function ContactCard() {
  return (
    <div className="  flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Contact Person */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Contact Person
              </p>
              <p className="text-lg font-semibold text-gray-900 truncate">
                Chinthaka Wijesinghe
              </p>
            </div>
          </div>

          {/* Mobile Number */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Mobile Number
              </p>
              <a
                href="tel:+94711921999"
                className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors duration-200 block truncate"
              >
                +94 71 192 1999
              </a>
            </div>
          </div>

          {/* Email Address */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Email Address
              </p>
              <a
                href="mailto:wonderchoice1000@gmail.com"
                className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors duration-200 block truncate"
              >
                wonderchoice1000@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">We'd love to hear from you!</p>
        </div>
      </div>
    </div>
  );
}

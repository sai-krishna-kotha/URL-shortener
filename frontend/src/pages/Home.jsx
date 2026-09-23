import Card from '../components/Card';
import URLForm from '../components/URLForm';
import { LinkIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center py-5 sm:py-8 lg:py-10">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-7 sm:mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Shorten Your Links
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-6">
            Create clean, memorable short URLs in seconds. Track clicks and performance seamlessly.
          </p>
        </div>

        <Card className="p-4 sm:p-6 lg:p-8 shadow-xl border-gray-100 w-full text-left">
          <div className="flex items-start gap-3 mb-5 sm:mb-6 border-b border-gray-100 pb-4">
            <div className="bg-indigo-100 p-2 rounded-xl flex-shrink-0">
              <LinkIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-6">
                Create a new short link
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-5">
                Paste your long URL below to get started.
              </p>
            </div>
          </div>
          <URLForm />
        </Card>
      </div>
    </div>
  );
}

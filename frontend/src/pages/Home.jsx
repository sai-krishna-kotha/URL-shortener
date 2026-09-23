import Card from '../components/Card';
import URLForm from '../components/URLForm';
import { LinkIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center py-6 sm:py-10 lg:py-12">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Shorten Your Links
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-7">
            Create clean, memorable short URLs in seconds. Track clicks and performance seamlessly.
          </p>
        </div>

        <Card className="p-4 sm:p-6 lg:p-10 shadow-xl border-gray-100 w-full text-left">
          <div className="flex items-start gap-3 mb-6 sm:mb-8 border-b border-gray-100 pb-4 sm:pb-5">
            <div className="bg-indigo-100 p-2 sm:p-2.5 rounded-xl flex-shrink-0">
              <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-7">
                Create a new short link
              </h2>
              <p className="text-sm text-gray-500 mt-1 leading-5">
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

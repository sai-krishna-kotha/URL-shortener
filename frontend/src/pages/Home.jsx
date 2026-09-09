import Card from '../components/Card';
import URLForm from '../components/URLForm';
import { LinkIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8 text-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Shorten Your Links
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Create clean, memorable short URLs in seconds. Track clicks and performance seamlessly.
          </p>
        </div>
        
        <Card className="p-6 sm:p-10 shadow-xl border-gray-100 w-full text-left">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-5">
            <div className="bg-indigo-100 p-2.5 rounded-xl">
              <LinkIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create a new short link</h2>
              <p className="text-sm text-gray-500 mt-1">Paste your long URL below to get started.</p>
            </div>
          </div>
          <URLForm />
        </Card>
      </div>
    </div>
  );
}

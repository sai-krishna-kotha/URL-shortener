import Card from '../components/Card';
import URLForm from '../components/URLForm';
import { LinkIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-10 md:py-20">
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Shorten your links, <br className="hidden sm:block" />
          <span className="text-indigo-600">expand your reach.</span>
        </h1>
        <p className="text-lg text-gray-600">
          A lightning-fast, reliable URL shortener for all your needs. 
          Create custom links, set expirations, and track your clicks in real-time.
        </p>
      </div>

      <Card className="w-full max-w-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Create a new short link</h2>
        </div>
        
        <URLForm />
      </Card>
    </div>
  );
}

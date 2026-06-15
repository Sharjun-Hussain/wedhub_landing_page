import React, { memo } from 'react';
import FadeIn from '@/components/FadeIn';
import { CheckSquare, Users, Wallet, CalendarDays, Laptop } from 'lucide-react';

const tools = [
  {
    name: 'Wedding Checklist',
    description: 'The ultimate wedding checklist to make sure everything gets done.',
    icon: CheckSquare,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    name: 'Guest List',
    description: 'Easily gather addresses, track RSVPs, and manage all your guests.',
    icon: Users,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    name: 'Budget Planner',
    description: 'Keep track of every penny so you can stay on budget effortlessly.',
    icon: Wallet,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    name: 'Vendor Manager',
    description: 'Organize your team of pros and keep their contact info handy.',
    icon: CalendarDays,
    color: 'bg-rose-100 text-rose-600',
  },
  {
    name: 'Wedding Website',
    description: 'Create a beautiful custom website to share details with guests.',
    icon: Laptop,
    color: 'bg-blue-100 text-blue-600',
  },
];

const PlanningTools = memo(function PlanningTools() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <FadeIn>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                Free Wedding Planning Tools
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We've got everything you need to plan your wedding, from finding the perfect venue to managing your guest list and everything in between.
              </p>
              
              <div className="space-y-6">
                {tools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <div key={index} className="flex items-start group cursor-pointer">
                      <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                          {tool.name}
                        </h4>
                        <p className="text-gray-600 mt-1">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="mt-10 bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-8 rounded-full transition-colors duration-200 inline-flex items-center">
                Start Planning Now
              </button>
            </div>
          </FadeIn>
          
          <FadeIn delay={200} className="hidden lg:block relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1597157639073-69284dc0f6ea?q=80&w=2074&auto=format&fit=crop" 
                alt="Wedding Planning" 
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl w-72 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">Tasks Completed</h4>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">80%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center"><CheckSquare className="w-4 h-4 text-emerald-500 mr-2" /> Book Venue</li>
                <li className="flex items-center"><CheckSquare className="w-4 h-4 text-emerald-500 mr-2" /> Hire Photographer</li>
                <li className="flex items-center text-gray-400"><div className="w-4 h-4 rounded border border-gray-300 mr-2" /> Send Invitations</li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
});

export default PlanningTools;

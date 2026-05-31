import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';

const packages = [
  {
    name: 'Starter Package',
    type: '(Beginner)',
    color: 'from-blue-400 to-blue-600',
    hoverColor: 'hover:border-blue-500',
    bgColor: 'bg-blue-50/50',
    popular: false,
  },
  {
    name: 'Advance Package',
    type: '(Intermediate/Advanced)',
    color: 'from-cyan-400 to-cyan-600',
    hoverColor: 'hover:border-cyan-500',
    bgColor: 'bg-cyan-50/50',
    popular: true,
  },
  {
    name: 'Yoga & Surf Retreat',
    type: '(All Levels)',
    color: 'from-teal-400 to-teal-600',
    hoverColor: 'hover:border-teal-500',
    bgColor: 'bg-teal-50/50',
    popular: false,
  },
];

const features = [
  {
    category: 'Accommodation & Meals',
    items: [
      { name: '7 nights accommodation', values: [true, true, true] },
      { name: 'Daily breakfast', values: [true, true, true] },
      { name: 'Daily dinner', values: [true, true, true] },
    ]
  },
  {
    category: 'Surfing & Coaching',
    items: [
      { name: 'Surf lessons', values: ['6 Lessons', '11 Lessons', 'Included'] },
      { name: 'Surf theory sessions', values: [true, true, true] },
      { name: 'Local surf guidance & support', values: [true, false, false] },
    ]
  },
  {
    category: 'Yoga & Wellness',
    items: [
      { name: 'Yoga sessions', values: ['2 Daily (Complimentary)', '2 Daily (Complimentary)', 'Daily'] },
      { name: 'Sunrise/Sunset yoga', values: [false, false, true] },
    ]
  },
  {
    category: 'Community & Activities',
    items: [
      { name: 'Social activities', values: ['Events', 'Events', 'Wellness Gatherings'] },
    ]
  },
  {
    category: 'Free Inclusions',
    items: [
      { name: 'Free water bottles', values: [true, true, true] },
      { name: 'Free surfboard use', values: [true, true, true] },
      { name: 'Free Ocean Air surf jersey', values: [true, true, true] },
    ]
  }
];

export function PackageComparisonTable() {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Compare Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Surf Packages</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Find the perfect balance of surf, yoga, and relaxation tailored to your experience level.
        </motion.p>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-6 md:p-8 bg-white border-b border-gray-100 w-1/4 align-bottom">
                <h3 className="text-xl font-bold text-gray-900">Features Included</h3>
              </th>
              {packages.map((pkg, idx) => (
                <th 
                  key={pkg.name} 
                  className={`p-6 md:p-8 border-b border-gray-100 w-1/4 relative transition-colors duration-300 ${hoveredCol === idx ? pkg.bgColor : 'bg-white'}`}
                  onMouseEnter={() => setHoveredCol(idx)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${pkg.color} mb-2`}></div>
                    <h4 className="text-lg md:text-xl font-bold text-gray-900">{pkg.name}</h4>
                    <span className="text-sm font-medium text-gray-500">{pkg.type}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((section, sectionIdx) => (
              <React.Fragment key={section.category}>
                <tr>
                  <td colSpan={4} className="bg-gray-50/80 py-4 px-6 md:px-8 text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100">
                    {section.category}
                  </td>
                </tr>
                {section.items.map((item, itemIdx) => (
                  <motion.tr 
                    key={item.name}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (sectionIdx * 0.1) + (itemIdx * 0.05) }}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-5 px-6 md:px-8 text-gray-700 font-medium">
                      {item.name}
                    </td>
                    {item.values.map((val, idx) => (
                      <td 
                        key={idx} 
                        className={`py-5 px-6 md:px-8 text-center transition-colors duration-300 ${hoveredCol === idx ? packages[idx].bgColor : ''}`}
                        onMouseEnter={() => setHoveredCol(idx)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        {typeof val === 'boolean' ? (
                          val ? (
                            <div className="flex justify-center">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                                <Check size={18} strokeWidth={2.5} />
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <Minus size={20} className="text-gray-300" strokeWidth={2} />
                            </div>
                          )
                        ) : (
                          <span className="font-semibold text-gray-800">{val}</span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

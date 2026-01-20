import { BlogSection, BlogSubsection } from '../../types/blog'


interface BlogContentProps {
  sections: BlogSection[];
  finalThoughts?: string[];
}

export default function BlogContent({ sections, finalThoughts }: BlogContentProps) {
  return (
    <div className="space-y-12 animate-slide-up">
      {/* Main Sections */}
      {sections.map((section, sectionIndex) => (
        <div 
          key={section._key || sectionIndex} 
          className="space-y-6"
          style={{ animationDelay: `${sectionIndex * 100}ms` }}
        >
          {/* Main Heading with Icon */}
          {section.heading && (
            <div className="flex items-start gap-3 pb-4 border-b border-light">
              <div className="mt-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
              <h2 className="text-2xl font-bold text-dark flex-1">
                {section.heading}
              </h2>
            </div>
          )}
          
          {/* Paragraphs */}
          <div className="space-y-4 ml-6">
            {section.paragraphs?.map((paragraph, paraIndex) => (
              <p 
                key={paraIndex} 
                className="text-gray-800 leading-relaxed text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Sub-sections */}
          {section.subsections?.map((subsection, subIndex) => (
            <div 
              key={subsection._key || subIndex} 
              className="ml-6 mt-6 p-4 bg-light/30 rounded-lg border border-light"
            >
              {/* Sub-heading */}
              {subsection.subheading && (
                <h3 className="text-xl font-semibold text-dark mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {subsection.subheading}
                </h3>
              )}
              
              {/* Sub-section content */}
              <div className="space-y-3">
                {subsection.content?.map((content, contentIndex) => (
                  <p key={contentIndex} className="text-gray-800 leading-relaxed">
                    {content}
                  </p>
                ))}
              </div>
              
              {/* List items */}
              {subsection.listItems && subsection.listItems.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {subsection.listItems.map((item, itemIndex) => (
                    <li 
                      key={itemIndex} 
                      className="flex items-start gap-2 text-gray-800"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
      
      {/* Final Thoughts with Decorative Box */}
      {finalThoughts && finalThoughts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-light relative">
          {/* Decorative element */}
          <div className="absolute -top-2 left-0 right-0 flex justify-center">
            <div className="w-12 h-1 bg-primary rounded-full"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Final Thoughts
          </h2>
          <div className="bg-secondary/50 p-6 rounded-xl border border-light">
            {finalThoughts.map((thought, index) => (
              <div 
                key={index} 
                className="mb-4 last:mb-0 flex gap-3"
              >
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-3"></div>
                <p className="text-gray-800 leading-relaxed text-lg">
                  {thought}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
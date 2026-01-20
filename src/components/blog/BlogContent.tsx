import { BlogSection, BlogSubsection } from '../../types/blog'

interface BlogContentProps {
  sections: BlogSection[];
  finalThoughts?: string[];
}

export default function BlogContent({ sections, finalThoughts }: BlogContentProps) {
  return (
    <div className="space-y-12">
      {/* Main Sections */}
      {sections.map((section, sectionIndex) => (
        <div 
          key={section._key || sectionIndex} 
          className="group"
          data-aos="fade-up"
          data-aos-delay={sectionIndex * 100}
        >
          {/* Main Heading */}
          {section.heading && (
            <div className="mb-6 relative">
              <div className="flex items-start gap-4 pb-4 border-b border-[#f7af00]">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#f7af00] flex items-center justify-center shadow-md">
                    <span className="text-xs font-medium text-[#050504]">{sectionIndex + 1}</span>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-medium text-[#050504] flex-1 leading-tight">
                  {section.heading}
                </h2>
              </div>
            </div>
          )}
          
          {/* Paragraphs */}
          <div className="space-y-6 ml-12">
            {section.paragraphs?.map((paragraph, paraIndex) => (
              <div 
                key={paraIndex} 
                className="relative"
              >
                <div className="absolute -left-4 top-3 w-2 h-2 bg-gradient-to-br from-[#f7af00] to-[#ffcc33] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-[#31302f] leading-relaxed text-lg md:text-xl">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>
          
          {/* Sub-sections */}
          {section.subsections?.map((subsection, subIndex) => (
            <div 
              key={subsection._key || subIndex} 
              className="ml-12 mt-8 p-6 bg-[#faf4e5] rounded-2xl border border-[#f7af00]/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Sub-heading with decorative line */}
              {subsection.subheading && (
                <div className="mb-6 relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#f7af00] to-transparent rounded-full"></div>
                  <h3 className="text-xl md:text-2xl font-medium text-[#050504] mb-2 flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#f7af00]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {subsection.subheading}
                  </h3>
                </div>
              )}
              
              {/* Sub-section content */}
              <div className="space-y-4">
                {subsection.content?.map((content, contentIndex) => (
                  <div key={contentIndex} className="relative pl-4">
                    <div className="absolute left-0 top-3 w-1 h-1 bg-[#f7af00] rounded-full"></div>
                    <p className="text-[#31302f] leading-relaxed">
                      {content}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* List items with checkmarks */}
              {subsection.listItems && subsection.listItems.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#f7af00]/10">
                  <ul className="space-y-3">
                    {subsection.listItems.map((item, itemIndex) => (
                      <li 
                        key={itemIndex} 
                        className="flex items-start gap-3 text-[#31302f] group/list-item"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f7af00]/20 to-[#ffcc33]/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/list-item:scale-110 transition-transform">
                          <svg className="w-3 h-3 text-[#f7af00]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      
      {/* Final Thoughts */}
      {finalThoughts && finalThoughts.length > 0 && (
        <div 
          className="mt-16 pt-10 border-t border-[#f7af00] relative"
          data-aos="fade-up"
        >
          <div className="bg-[#faf4e5] rounded-3xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#f7af00] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#050504]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-medium text-[#050504]">
                Key Takeaways
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {finalThoughts.map((thought, index) => (
                <div 
                  key={index} 
                  className="relative pl-10"
                >
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#faf4e5] border border-[#f7af00]/30 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#f7af00]">{index + 1}</span>
                  </div>
                  <div className="bg-[#faf4e5] backdrop-blur-sm p-4 rounded-xl">
                    <p className="text-[#31302f] leading-relaxed">
                      {thought}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Closing statement */}
            <div className="mt-10 pt-6 border-t border-[#f7af00]/20 text-center">
              <p className="text-lg text-[#31302f] italic">
                Thanks for reading! Feel free to share your thoughts in the comments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating action buttons for mobile */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 md:hidden z-50">
        <button className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f7af00] to-[#ffcc33] shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-[#050504]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
          </svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-[#050504] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
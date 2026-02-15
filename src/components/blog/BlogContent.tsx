interface TableRow {
  _key?: string
  cells: string[]
}

interface Table {
  _key?: string
  hasHeader?: boolean
  rows: TableRow[]
}

interface Subsection {
  _key: string
  subheading: string
  content?: string[]
  listItems?: string[]
}

interface Section {
  _key: string
  heading: string
  paragraphs: string[]
  subsections?: Subsection[]
  tables?: Table[]   // ✅ NEW
}

interface BlogContentProps {
  sections: Section[]
  finalThoughts?: string[]
}

export default function BlogContent({ sections, finalThoughts }: BlogContentProps) {
  return (
    <div className="space-y-10">
      {sections?.map((section, sectionIndex) => (
        <div key={section._key} className="group">
          
          {/* Heading */}
          {section.heading && (
            <div className="mb-6 relative">
              <div className="flex items-start gap-4 pb-4 border-b-2 border-[#f7af00]">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#f7af00] flex items-center justify-center shadow-md">
                    <span className="text-xs font-bold text-[#050504]">
                      {sectionIndex + 1}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-medium text-[#050504] flex-1 leading-tight">
                  {section.heading}
                </h2>
              </div>
            </div>
          )}

          {/* Paragraphs */}
          <div className="space-y-5 ml-12">
            {section.paragraphs?.map((para, paraIndex) => (
              <p key={paraIndex} className="text-[#31302f] leading-relaxed text-lg">
                {para}
              </p>
            ))}
          </div>

          {/* ================= TABLES ================= */}
          {section.tables?.map((table, tableIndex) => (
            <div
              key={table._key || tableIndex}
              className="ml-12 mt-8 overflow-x-auto"
            >
              <div className="rounded-lg border border-[#f7af00]/40 shadow-sm">
                <table className="min-w-full text-left border-collapse">
                  <tbody>
                    {table.rows?.map((row, rowIndex) => {
                      const isHeader = table.hasHeader && rowIndex === 0

                      return (
                        <tr
                          key={row._key || rowIndex}
                          className={isHeader ? "bg-[#f7af00]/20" : "bg-white"}
                        >
                          {row.cells?.map((cell, cellIndex) =>
                            isHeader ? (
                              <th
                                key={cellIndex}
                                className="border border-[#f7af00]/30 px-4 py-3 text-[#050504] font-semibold"
                              >
                                {cell}
                              </th>
                            ) : (
                              <td
                                key={cellIndex}
                                className="border border-[#f7af00]/20 px-4 py-3 text-[#31302f]"
                              >
                                {cell}
                              </td>
                            )
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Subsections */}
          {section.subsections?.map((subsection) => (
            <div
              key={subsection._key}
              className="ml-12 mt-8 p-6 bg-[#f0eadd] rounded-lg border border-[#f7af00] shadow-sm hover:shadow-md transition-all"
            >
              {subsection.subheading && (
                <div className="mb-5">
                  <h3 className="text-xl font-medium text-[#050504] flex items-center gap-2 mb-2">
                    <span className="w-1 h-6 bg-[#f7af00] rounded-full" />
                    {subsection.subheading}
                  </h3>
                </div>
              )}

              {subsection.content && subsection.content.length > 0 && (
                <div className="space-y-4 mb-5">
                  {subsection.content.map((content, idx) => (
                    <p key={idx} className="text-[#31302f] leading-relaxed">
                      {content}
                    </p>
                  ))}
                </div>
              )}

              {subsection.listItems && subsection.listItems.length > 0 && (
                <ul className="space-y-3">
                  {subsection.listItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#31302f]">
                      <span className="w-5 h-5 rounded-full bg-[#f7af00] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          className="w-3 h-3 text-[#31302f]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Final Thoughts */}
      {finalThoughts && finalThoughts.length > 0 && (
        <div className="mt-14 pt-10 border-t-2 border-[#f7af00]">
          <div className="bg-[#faf4e5] rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#f7af00] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#050504]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-[#050504]">
                Key Takeaways
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {finalThoughts.map((thought, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#f7af00] flex items-center justify-center flex-shrink-0 font-bold text-[#050504] text-sm">
                    {index + 1}
                  </div>
                  <p className="text-[#31302f] leading-relaxed">
                    {thought}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

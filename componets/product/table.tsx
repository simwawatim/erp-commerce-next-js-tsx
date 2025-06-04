import React from 'react';

const ProductsTable = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 2;

  const projects = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100',
      name: 'Project Alpha',
      description: 'First release of the product.',
      isAvailable: true,
      quantity: 50,
      createdBy: 'Alice',
      createdAt: '2023-01-15',
      updatedBy: 'Bob',
      updatedAt: '2023-03-01',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=100',
      name: 'Project Beta',
      description: 'Internal tool for automation.',
      isAvailable: false,
      quantity: 20,
      createdBy: 'Charlie',
      createdAt: '2023-02-10',
      updatedBy: 'Dana',
      updatedAt: '2023-04-10',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100',
      name: 'Project Gamma',
      description: 'Beta testing program.',
      isAvailable: true,
      quantity: 100,
      createdBy: 'Eve',
      createdAt: '2023-03-22',
      updatedBy: 'Frank',
      updatedAt: '2023-05-01',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100',
      name: 'Project Delta',
      description: 'Customer portal redesign.',
      isAvailable: true,
      quantity: 75,
      createdBy: 'Grace',
      createdAt: '2023-04-05',
      updatedBy: 'Henry',
      updatedAt: '2023-06-15',
    },
  ];

  const totalPagesCalculated = Math.ceil(projects.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = projects.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPagesCalculated) {
      setCurrentPage(page);
    }
  };

  const getStatusBadge = (isAvailable: boolean) => {
    return isAvailable ? (
      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
        Available
      </span>
    ) : (
      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
        Unavailable
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 whitespace-nowrap">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Image</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Name</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Description</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Status</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Quantity</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Created By</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Created Date</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Updated By</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Updated Date</th>
            <th className="p-4 text-left text-sm font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {currentRows.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="p-4">
                <img 
                  src={project.image} 
                  alt={project.name} 
                  className="w-10 h-10 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                  }}
                />
              </td>
              <td className="p-4 text-slate-900 font-medium">{project.name}</td>
              <td className="p-4 text-slate-600 max-w-xs truncate">{project.description}</td>
              <td className="p-4">
                {getStatusBadge(project.isAvailable)}
              </td>
              <td className="p-4 text-slate-600">{project.quantity}</td>
              <td className="p-4 text-slate-600">{project.createdBy}</td>
              <td className="p-4 text-slate-600">{project.createdAt}</td>
              <td className="p-4 text-slate-600">{project.updatedBy}</td>
              <td className="p-4 text-slate-600">{project.updatedAt}</td>
              <td className="p-4 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM4 21q-.425 0-.712-.288Q3 20.425 3 20v-2.825q0-.2.075-.387.075-.188.225-.338l10.3-10.3 4.25 4.25-10.3 10.3q-.15.15-.337.225-.188.075-.388.075Zm14.775-12.85l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387Z"/>
                  </svg>
                </button>
                <button className="text-red-500 hover:text-red-700" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <p className="text-slate-600">
          Page {currentPage} of {totalPagesCalculated}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPagesCalculated }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPagesCalculated}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
// import { useState } from 'react';
// import useWindowSize from '../hooks/useWindowSize'; // Import the hook
// const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
// function NotesModal({ problem, onSave, onClose }) {
//   const [notes, setNotes] = useState(problem.notes || '');
//   const [saveHovered, setSaveHovered] = useState(false);
//   const [cancelHovered, setCancelHovered] = useState(false);
//   const [textareaFocused, setTextareaFocused] = useState(false);
//   const { width } = useWindowSize();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(problem._id, notes);
//   };

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 1000,
//         padding: width < 768 ? '1rem' : '0',
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: '#fff',
//           padding: width < 768 ? '1rem' : '2rem',
//           borderRadius: '16px',
//           width: width < 768 ? '100%' : '500px',
//           maxWidth: '90%',
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//         }}
//       >
//         <h2
//           style={{
//             fontSize: width < 768 ? '1.2rem' : '1.5rem',
//             fontWeight: 600,
//             color: '#1a1a1a',
//             marginBottom: width < 768 ? '1rem' : '1.5rem',
//             letterSpacing: '-0.02em',
//           }}
//         >
//           Edit Notes for {problem.title}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <textarea
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             placeholder="Add your notes here..."
//             style={{
//               width: '100%',
//               height: width < 768 ? '120px' : '150px',
//               padding: width < 768 ? '0.6rem' : '0.8rem',
//               border: `1px solid rgba(0, 0, 0, 0.1)`,
//               borderRadius: '8px',
//               fontSize: width < 768 ? '0.9rem' : '0.95rem',
//               backgroundColor: '#fff',
//               resize: 'none',
//               transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
//               borderColor: textareaFocused ? '#007aff' : 'rgba(0, 0, 0, 0.1)',
//               boxShadow: textareaFocused ? '0 0 0 3px rgba(0, 122, 255, 0.1)' : 'none',
//             }}
//             onFocus={() => setTextareaFocused(true)}
//             onBlur={() => setTextareaFocused(false)}
//           />
//           <div
//             style={{
//               display: 'flex',
//               gap: width < 768 ? '0.5rem' : '0.8rem',
//               marginTop: width < 768 ? '1rem' : '1.5rem',
//               justifyContent: 'flex-end',
//             }}
//           >
//             <button
//               type="button"
//               onClick={onClose}
//               style={{
//                 backgroundColor: cancelHovered ? '#e32b20' : '#ff3b30',
//                 color: '#fff',
//                 border: 'none',
//                 padding: width < 768 ? '0.5rem 1rem' : '0.6rem 1.2rem',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 fontWeight: 600,
//                 transition: 'background-color 0.3s ease, transform 0.1s ease',
//                 boxShadow: '0 2px 8px rgba(255, 59, 48, 0.2)',
//                 fontSize: width < 768 ? '0.85rem' : '1rem',
//               }}
//               onMouseEnter={() => setCancelHovered(true)}
//               onMouseLeave={() => setCancelHovered(false)}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               style={{
//                 backgroundColor: saveHovered ? '#0066cc' : '#007aff',
//                 color: '#fff',
//                 border: 'none',
//                 padding: width < 768 ? '0.5rem 1rem' : '0.6rem 1.2rem',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 fontWeight: 600,
//                 transition: 'background-color 0.3s ease, transform 0.1s ease',
//                 boxShadow: '0 2px 8px rgba(0, 122, 255, 0.2)',
//                 fontSize: width < 768 ? '0.85rem' : '1rem',
//               }}
//               onMouseEnter={() => setSaveHovered(true)}
//               onMouseLeave={() => setSaveHovered(false)}
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default NotesModal;
import { useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';

const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

function NotesModal({ problem, onSave, onClose }) {
  const [notes, setNotes] = useState(problem.notes || '');
  const [saveHovered, setSaveHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);
  const [textareaFocused, setTextareaFocused] = useState(false);
  const { width } = useWindowSize();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(problem._id, notes);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#1a1a1a',
            marginBottom: '1.5rem',
          }}
        >
          Edit Notes for {problem.title}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            style={{
              width: '100%',
              minHeight: '140px',
              padding: '0.8rem',
              borderRadius: '10px',
              fontSize: '1rem',
              lineHeight: '1.5',
              border: `1px solid ${textareaFocused ? '#007aff' : 'rgba(0, 0, 0, 0.1)'}`,
              boxShadow: textareaFocused ? '0 0 0 3px rgba(0, 122, 255, 0.15)' : 'none',
              resize: 'vertical',
              transition: 'all 0.2s ease',
            }}
            onFocus={() => setTextareaFocused(true)}
            onBlur={() => setTextareaFocused(false)}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.8rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: cancelHovered ? '#d7281f' : '#ff3b30',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'background-color 0.3s ease',
                boxShadow: '0 2px 8px rgba(255, 59, 48, 0.2)',
              }}
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                backgroundColor: saveHovered ? '#0066cc' : '#007aff',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'background-color 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 122, 255, 0.2)',
              }}
              onMouseEnter={() => setSaveHovered(true)}
              onMouseLeave={() => setSaveHovered(false)}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NotesModal;


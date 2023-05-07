import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  onSubmit: (additionalData: string) => void;
  onClose: () => void;
}

export const AdditionalDataModal: FC<Props> = ({
  value,
  onSubmit,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [additionalData, setAdditionalData] = useState<string>(value);

  const handleSubmit = () => {
    onSubmit(additionalData);
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // useEffect(() => {
  //   const handleMouseDown = (e: MouseEvent) => {
  //     if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
  //       window.addEventListener('mouseup', handleMouseUp);
  //     }
  //   };

  //   const handleMouseUp = (e: MouseEvent) => {
  //     window.removeEventListener('mouseup', handleMouseUp);
  //     onClose();
  //   };

  //   window.addEventListener('mousedown', handleMouseDown);

  //   return () => {
  //     window.removeEventListener('mousedown', handleMouseDown);
  //   };
  // }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onKeyDown={handleKeyDown}
      onClick={() => onClose()}
    >
      <div
        ref={modalRef}
        className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4" key='0'>
          <div className="mb-2 text-sm font-bold text-neutral-200">
            Additional Data
          </div>
          <textarea
            className="mt-1 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
            style={{ resize: 'none' }}
            onChange={(e) => setAdditionalData(e.target.value)}
            rows={3}
            value={additionalData}
          />
        </div>
        <button
          className="mt-6 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

import { useAppDispatch, useAppSelector } from '../../../hooks';
import { closeModal, selectModal } from '../../../features/modal';
import { useEffect, useRef } from 'react';

interface Props {
	children: React.ReactNode;
	clearData?: () => void;
}
export const Modal = ({ children, clearData }: Props) => {
	const modalRef = useRef<HTMLDivElement>(null);

	const { isOpen } = useAppSelector(selectModal);

	const dispatch = useAppDispatch();

	const handleClickOutside = (e: MouseEvent) => {
		e.stopPropagation();
		if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
			dispatch(closeModal());
			if (clearData) {
				clearData();
			}
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 ">
			<div onClick={(e) => e.stopPropagation()} ref={modalRef} className="bg-white p-2 rounded-lg shadow-md">
				{children}
			</div>
		</div>
	);
};

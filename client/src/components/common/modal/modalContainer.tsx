import { useAppSelector, useOrderFormData } from '../../../hooks';
import { Modal } from './modal';
import { ProductForm } from '../productForm';
import { selectSelectedProduct } from '../../../features/product/product.selector';
import { selectModal } from '../../../features/modal';
import { OrderForm } from '../orderForm';
import { SupplierForm } from '../supplierForm';
import { selectseletectedSupplier } from '../../../features/supplier';
import { CategoryForm } from '../categoryForm';
import { selectSelectedCategory } from '../../../features/category';
import { EFormModalType } from '../../../enums';
import { useMemo } from 'react';
import { useClearModalFormData } from '../../../hooks/modal.hook';

export const ModalContainer = () => {
	const { isEdit, formModalType } = useAppSelector(selectModal);

	const productInitialValue = useAppSelector(selectSelectedProduct);

	const supplierInitialValue = useAppSelector(selectseletectedSupplier);

	const categoryInitialValue = useAppSelector(selectSelectedCategory);
	const orderInitialValue = useOrderFormData();

	const modalKey = new Date().toISOString();

	const clearModalFormDate = useClearModalFormData();

	const modalContent = useMemo(() => {
		switch (formModalType) {
			case EFormModalType.PRODUCT:
				return <ProductForm isEdit={isEdit} productData={productInitialValue!} key={modalKey} />;
			case EFormModalType.ORDER:
				return <OrderForm orderData={orderInitialValue!} isEdit={isEdit} key={modalKey} />;
			case EFormModalType.SUPPLIER:
				return <SupplierForm supplierData={supplierInitialValue} isEdit={isEdit} key={modalKey} />;
			case EFormModalType.CATEGORY:
				return (
					formModalType === EFormModalType.CATEGORY && (
						<CategoryForm key={modalKey} isEdit={isEdit} initialData={categoryInitialValue} />
					)
				);
			default:
				return null;
		}
	}, [
		isEdit,
		productInitialValue,
		supplierInitialValue,
		orderInitialValue,
		modalKey,
		formModalType,
		categoryInitialValue,
	]);
	return <Modal onClose={() => clearModalFormDate(formModalType)}>{modalContent}</Modal>;
};

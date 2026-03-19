import { supplierRepo, type ISupplierRepository } from '../repositories/supplier.repository.js';
import { type TSupplier, type TSupplierBase } from '../schema/suppliers.schema.js';
import { BaseController } from './base.controller.js';

class SupllierControler extends BaseController<TSupplier, TSupplierBase, ISupplierRepository> {
	constructor() {
		super(supplierRepo);
	}
}

export const supplierController = new SupllierControler();

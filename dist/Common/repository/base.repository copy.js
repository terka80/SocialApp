"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBASErRepository = void 0;
class DataBASErRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create({ data, options, }) {
        return await this.model.create(data);
    }
}
exports.DataBASErRepository = DataBASErRepository;

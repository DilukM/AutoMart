"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicleDTO = void 0;
var class_validator_1 = require("class-validator");
var VehicleType_1 = require("@/shared/types/VehicleType");
var UpdateVehicleDTO = function () {
    var _a;
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _brand_decorators;
    var _brand_initializers = [];
    var _brand_extraInitializers = [];
    var _modelName_decorators;
    var _modelName_initializers = [];
    var _modelName_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _engineSize_decorators;
    var _engineSize_initializers = [];
    var _engineSize_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _images_decorators;
    var _images_initializers = [];
    var _images_extraInitializers = [];
    var _imagesToRemove_decorators;
    var _imagesToRemove_initializers = [];
    var _imagesToRemove_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateVehicleDTO() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.brand = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _brand_initializers, void 0));
                this.modelName = (__runInitializers(this, _brand_extraInitializers), __runInitializers(this, _modelName_initializers, void 0));
                this.color = (__runInitializers(this, _modelName_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.engineSize = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _engineSize_initializers, void 0));
                this.year = (__runInitializers(this, _engineSize_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.price = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.images = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _images_initializers, void 0));
                this.imagesToRemove = (__runInitializers(this, _images_extraInitializers), __runInitializers(this, _imagesToRemove_initializers, void 0));
                this.description = (__runInitializers(this, _imagesToRemove_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
            return UpdateVehicleDTO;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(VehicleType_1.VehicleType)];
            _brand_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _modelName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _color_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _engineSize_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _year_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1900), (0, class_validator_1.Max)(new Date().getFullYear() + 1)];
            _price_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.01)];
            _images_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _imagesToRemove_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _brand_decorators, { kind: "field", name: "brand", static: false, private: false, access: { has: function (obj) { return "brand" in obj; }, get: function (obj) { return obj.brand; }, set: function (obj, value) { obj.brand = value; } }, metadata: _metadata }, _brand_initializers, _brand_extraInitializers);
            __esDecorate(null, null, _modelName_decorators, { kind: "field", name: "modelName", static: false, private: false, access: { has: function (obj) { return "modelName" in obj; }, get: function (obj) { return obj.modelName; }, set: function (obj, value) { obj.modelName = value; } }, metadata: _metadata }, _modelName_initializers, _modelName_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _engineSize_decorators, { kind: "field", name: "engineSize", static: false, private: false, access: { has: function (obj) { return "engineSize" in obj; }, get: function (obj) { return obj.engineSize; }, set: function (obj, value) { obj.engineSize = value; } }, metadata: _metadata }, _engineSize_initializers, _engineSize_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _images_decorators, { kind: "field", name: "images", static: false, private: false, access: { has: function (obj) { return "images" in obj; }, get: function (obj) { return obj.images; }, set: function (obj, value) { obj.images = value; } }, metadata: _metadata }, _images_initializers, _images_extraInitializers);
            __esDecorate(null, null, _imagesToRemove_decorators, { kind: "field", name: "imagesToRemove", static: false, private: false, access: { has: function (obj) { return "imagesToRemove" in obj; }, get: function (obj) { return obj.imagesToRemove; }, set: function (obj, value) { obj.imagesToRemove = value; } }, metadata: _metadata }, _imagesToRemove_initializers, _imagesToRemove_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateVehicleDTO = UpdateVehicleDTO;

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { LeavesService } from './leaves.service.js';
import { LeavesController } from './leaves.controller.js';
let LeavesModule = class LeavesModule {
};
LeavesModule = __decorate([
    Module({
        controllers: [LeavesController],
        providers: [LeavesService],
        exports: [LeavesService],
    })
], LeavesModule);
export { LeavesModule };
//# sourceMappingURL=leaves.module.js.map
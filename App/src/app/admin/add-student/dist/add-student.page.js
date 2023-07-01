"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AddStudentPage = void 0;
var core_1 = require("@angular/core");
var date_fns_1 = require("date-fns");
var AddStudentPage = /** @class */ (function () {
    function AddStudentPage() {
        this.selectedMode = 'date';
        this.showPicker = false;
        this.dateValue = date_fns_1.format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z';
        this.formattedString = '';
        this.setToday();
    }
    AddStudentPage.prototype.setToday = function () {
        this.formattedString = date_fns_1.format(date_fns_1.parseISO(date_fns_1.format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z'), 'MMM d, yyyy');
    };
    AddStudentPage.prototype.dateChanged = function (value) {
        this.dateValue = value;
        this.formattedString = date_fns_1.format(date_fns_1.parseISO(value), 'MMM d, yyyy');
        this.showPicker = false;
    };
    AddStudentPage.prototype.ngOnInit = function () {
    };
    AddStudentPage = __decorate([
        core_1.Component({
            selector: 'app-add-student',
            templateUrl: './add-student.page.html',
            styleUrls: ['./add-student.page.scss']
        })
    ], AddStudentPage);
    return AddStudentPage;
}());
exports.AddStudentPage = AddStudentPage;

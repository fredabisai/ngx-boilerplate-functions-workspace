import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {FormsFunctionsService} from "ngx-boilerplate-functions";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'boilerplate-testing-app';
  form: UntypedFormGroup | undefined;
  constructor(private formBuilder: UntypedFormBuilder,
              private formBoilerplateService: FormsFunctionsService) {
    this.form = this.formBuilder.group({
      name: [undefined, [Validators.required]],
    })
    this.formBoilerplateService.addFormControl(this.form, 'email', new UntypedFormControl([Validators.required, Validators.email]))
    console.log(this.form.contains('email'));
  }
}

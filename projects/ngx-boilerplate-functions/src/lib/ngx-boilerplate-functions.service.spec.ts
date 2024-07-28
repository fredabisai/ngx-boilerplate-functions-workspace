import { TestBed } from '@angular/core/testing';

import { NgxBoilerplateFunctionsService } from './ngx-boilerplate-functions.service';

describe('NgxBoilerplateFunctionsService', () => {
  let service: NgxBoilerplateFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxBoilerplateFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

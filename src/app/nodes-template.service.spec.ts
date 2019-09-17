import { TestBed } from '@angular/core/testing';

import { NodesTemplateService } from './nodes-template.service';

describe('NodesTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodesTemplateService = TestBed.get(NodesTemplateService);
    expect(service).toBeTruthy();
  });
});

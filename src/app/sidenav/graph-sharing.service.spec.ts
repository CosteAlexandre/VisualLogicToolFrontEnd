import { TestBed } from '@angular/core/testing';

import { GraphSharingService } from './graph-sharing.service';

describe('GraphSharingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphSharingService = TestBed.get(GraphSharingService);
    expect(service).toBeTruthy();
  });
});

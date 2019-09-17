import { TestBed } from '@angular/core/testing';

import { SocketWbService } from './socket-wb.service';

describe('SocketWbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketWbService = TestBed.get(SocketWbService);
    expect(service).toBeTruthy();
  });
});

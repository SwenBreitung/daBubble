import { TestBed } from '@angular/core/testing';

import { EmojiBarService } from './emoji-bar.service';

describe('EmojiBarService', () => {
  let service: EmojiBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmojiBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

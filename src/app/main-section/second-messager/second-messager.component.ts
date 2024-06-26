import { AfterViewInit, Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import {MessageService} from '../../service/massage.service';
import { AuthService } from './../../service/auth.service';
import {NoteListService} from '../../service/note-list.service';
import { Subscription } from 'rxjs';
import { MessageInputComponent } from '../message-input/message-input.component';
import { ChannelService } from '../../service/channels.service';
import { EmojiBarService } from "../../service/emoji-bar.service";
@Component({
  selector: 'app-second-messager',
  templateUrl: './second-messager.component.html',
  styleUrl: './second-messager.component.scss'
})
export class SecondMessagerComponent implements AfterViewInit{
  @ViewChild(MessageInputComponent) messageInputComponent: MessageInputComponent | undefined;
  constructor(
    public channelService: ChannelService,
    public messageService:MessageService,
    public  authService: AuthService,
    private noteService: NoteListService,
    private renderer: Renderer2,
    public emojiBarService:EmojiBarService,
  ) {}


  @ViewChild('emojiMart') emojiMart: ElementRef | undefined;

  ngAfterViewInit() {
    if(this.emojiMart){
      this.renderer.setStyle(this.emojiMart.nativeElement, 'width', '100%');
    }   
  }
  
  showEmojiPicker: boolean = false;
  showMainEmojiPicker = false;
  

  switchSecondChatFunktion=true;
  currentSecondChannel:string = '';
  secondMessages:any;
  @ViewChild('scondTextarea') scondTextarea: ElementRef | undefined;
  private scondMessageSubscription: Subscription | undefined;
  @ViewChild('contentDiv') contentDiv!: ElementRef;
@Output() emojiInsert: EventEmitter<string> = new EventEmitter<string>();

  ngOnDestroy() {
    if (this.scondMessageSubscription) {
      this.scondMessageSubscription.unsubscribe();
    }
  }


  ngOnInit() {
    this.messageService.currentsecondMessages$.subscribe(secondMessages => {
      this.messageService.secondMessages = secondMessages;
    });
  }


  onEmojiClick(event: any, elementId: string) {
    const emoji = event.emoji.native;
    const element = document.getElementById(elementId);
    this.handleEmojiInsert(emoji)
    if (element) {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.value += emoji;
      } else {
        this.emojiBarService.addEmojiToMessage(elementId,emoji, this.messageService.currentChannelId, this.authService.currentUser.uid);
      }
    }
  }


  handleEmojiInsert(emoji: any) {
    if(this.messageInputComponent){
      this.messageInputComponent.insertEmoji(emoji);
    }
  }

  
  toggleEmojiPicker(pickerType:any) {
    if (pickerType === 'main') {
      this.emojiBarService.showMainEmojiPicker = !this.emojiBarService.showMainEmojiPicker;
    } else if (pickerType === 'second') {
      this.emojiBarService.showSecondEmojiPicker = !this.emojiBarService.showSecondEmojiPicker;
    }
  }
  onEmojiSelect(event: any) {}


  closeLeftWindow(){
    this.messageService.torgleRightSide =false;
  }

  
  insertEmoji(emoji: string) {
    const div = this.contentDiv.nativeElement;
    this.moveCursorToEnd(div); // Setzt den Cursor zuerst ans Ende
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = document.createTextNode(emoji);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      div.appendChild(document.createTextNode(emoji));
    }
  }


  moveCursorToEnd(div:any) {
    const selection = window.getSelection();
    if (selection) { 
      const range = document.createRange();
      selection.removeAllRanges();
      range.selectNodeContents(div);
      range.collapse(false); 
      selection.addRange(range);
    }
  }

  
}

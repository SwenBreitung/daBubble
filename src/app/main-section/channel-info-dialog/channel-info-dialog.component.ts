import { Component } from '@angular/core';
import { MessageService } from './../../firebase-services/massage.service';
import { ChannelService } from './../../firebase-services/channels.service'
@Component({
  selector: 'app-channel-info-dialog',
  templateUrl: './channel-info-dialog.component.html',
  styleUrl: './channel-info-dialog.component.scss'
})
export class ChannelInfoDialogComponent {

  constructor(
    public messageService: MessageService,
    public channelService: ChannelService
  ) {

  }
  newChannelInfo: string = '';
  newChannelName: string = '';
  editChannelName = false;
  editChannelInfo = false;


  editInfoChannel() {
    this.editChannelInfo = true;
  }


  editNameChannel() {
    this.editChannelName = true;
  }


  saveNameChannel() {
    this.editChannelName = false;
    this.channelService.updateChannelProperties(this.messageService.channelInfos.id, 'name', this.newChannelName)
  }


  saveInfoChannel() {
    this.editChannelInfo = false;
    this.channelService.updateChannelProperties(this.messageService.channelInfos.id, 'information', this.newChannelInfo)
  }

}

import { Component } from '@angular/core';
import {ChannelService} from './../firebase-services/channels.service'
import { MatDialogRef } from '@angular/material/dialog';
import {Channel} from './../models/channel.class';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrl: './add-channel-dialog.component.scss'
})


export class AddChannelDialogComponent {
  channel: Channel = new Channel();

constructor(
  public channelService: ChannelService,
   private dialogRef: MatDialogRef<AddChannelDialogComponent>

  ){}

 closeDialog(){
  this.channelService.addChannel(this.channel.toJson());
  this.dialogRef.close();
}



}

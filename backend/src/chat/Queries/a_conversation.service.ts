import { Injectable } from '@nestjs/common';
import { Privacy, Status } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateConversationDto,
  UpdateConversationDto,
} from '../dto/conversation.dto';

@Injectable()
export class a_ConversationService {
  constructor(private prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto) {
    return await this.prisma.conversation.create({
      data: {
        title: createConversationDto.title,
        creator_id: createConversationDto.creator_id,
        privacy: Privacy[createConversationDto.privacy],
      },
    });
  }
  async createWithPassword(createConversationDto: CreateConversationDto) {
    return await this.prisma.conversation.create({
      data: {
        title: createConversationDto.title,
        creator_id: createConversationDto.creator_id,
        password: createConversationDto.password,
        privacy: Privacy[createConversationDto.privacy],
      },
      include: {
        participants: true,
        messages: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.conversation.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.conversation.findUnique({
      where: {
        id: id,
      },
    });
  }

  //   async findAllPublicConversation(idGiven: string) {
  // 	return await this.prisma.conversation.findMany({
  // 	  where: {
  // 		NOT: {
  // 		  id: idGiven,
  // 		},
  // 		AND: {
  // 		  privacy: Privacy.PUBLIC,
  // 		},
  // 	  },
  // 	});
  //   }

  async update(id: string, updateConversationDto: UpdateConversationDto) {
    return await this.prisma.conversation.update({
      where: {
        id: id,
      },
      data: {
        title: updateConversationDto.title,
        creator_id: updateConversationDto.creator_id,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.conversation.delete({
      where: {
        id: id,
      },
    });
  }

  async addParticipant(conversation_id: string, user_id: string) {
    return await this.prisma.participant.create({
      data: {
        user_id: user_id,
        conversation_id: conversation_id,
      },
    });
  }

  async removeParticipant(conversation_id: string, user_id: string) {
    return await this.prisma.participant.delete({
      where: {
        conversation_id_user_id: {
          user_id: user_id,
          conversation_id: conversation_id,
        },
      },
    });
  }

  async getParticipants(conversation_id: string) {
    return await this.prisma.participant.findMany({
      where: {
        conversation_id: conversation_id,
      },
    });
  }

  async getConversationByCreatorID(creator_id: string) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
      },
    });
  }

  async getMessages(conversation_id: string) {
    return await this.prisma.message.findMany({
      where: {
        conversation_id: conversation_id,
      },
    });
  }

  async getConversationByUserId(user_id: string) {
    return await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            user_id: user_id,
          },
        },
      },
      include: {
        messages: true,
      },
    });
  }

  async getConversationWithParticipants(id: string) {
    return await this.prisma.conversation.findUnique({
      where: {
        id: id,
      },
      include: {
        participants: true,
      },
    });
  }

  async getConversationByCreatorId(creator_id: string) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
      },
    });
  }

  async getConversationByTitle(title: string) {
    return await this.prisma.conversation.findMany({
      where: {
        title: title,
      },
    });
  }

  async getConversationByPrivacy(privacy: Privacy) {
    return await this.prisma.conversation.findMany({
      where: {
        privacy: privacy,
      },
      include: {
        messages: true,
        participants: true,
      },
    });
  }

  async getConversationByCreatorIdAndPrivacy(
    creator_id: string,
    privacy: string,
  ) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
        privacy: Privacy.PUBLIC,
      },
    });
  }

  async getConversationByCreatorIdAndTitle(creator_id: string, title: string) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
        title: title,
      },
    });
  }

  async getConversationByCreatorIdAndTitleAndPrivacy(
    creator_id: string,
    title: string,
    privacy: string,
  ) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
        title: title,
        privacy: Privacy.PUBLIC,
      },
    });
  }

  async getConversationByUserIdAndPrivacy(user_id: string, privacy: Privacy) {
    return await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            user_id: user_id,
          },
        },
        privacy: privacy,
      },
      include: {
        messages: true,
        participants: true,
      },
    });
  }
  async getConversationByUserIdAndPrivacyAndStatus(
    user_id: string,
    privacy: Privacy,
  ) {
    return await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            user_id: user_id,
            conversation_status: Status.ACTIVE,
          },
        },
        privacy: privacy,
      },
      include: {
        messages: true,
        participants: true,
      },
    });
  }

  async getConversationByUserIdAndPrivacyConversationID(
    user_id: string,
    privacy: Privacy,
    conversation_id: string,
  ) {
    return await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            user_id: user_id,
            conversation_id: conversation_id,
          },
        },
        privacy: privacy,
      },
      include: {
        messages: true,
        participants: true,
      },
    });
  }

  async getConversationByUserIdAndTitle(user_id: string, title: string) {
    return await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            user_id: user_id,
          },
        },
        title: title,
      },
    });
  }

  async getDirectConversation(user_id: string, creator_id: string) {
    return await this.prisma.conversation.findMany({
      where: {
        creator_id: creator_id,
        privacy: Privacy.DIRECT,
        participants: {
          every: {
            user_id: user_id,
          },
        },
      },
    });
  }
}

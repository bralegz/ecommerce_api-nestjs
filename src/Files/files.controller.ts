import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../Auth/guards/AuthGuard.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload an image',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Product image could not be updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Product could not be found',
  })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      example: [
        {
          id: '46d9d449-e2cd-4fbd-a59b-19230094b606',
          name: 'Iphone 15',
          description: 'Just another product',
          price: '300.00',
          stock: 12,
          imgUrl:
            'https://res.cloudinary.com/dvsnmcjsd/image/upload/v1727536328/ttimagx9sl6ws1okuygc.webp',
        },
      ],
    },
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'The file is too big',
          }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id') productId: string,
    @Req() req: Request & { user: any },
  ) {
    console.log(req.user);
    return this.filesService.uploadImage(productId, file);
  }
}

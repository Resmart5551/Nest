import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND, REVIEWS_NOT_FOUND } from './reviewConstatns';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) { }

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND)
		}
	}

	@UseGuards(JWTAuthGuard)
	@Delete(':productId')
	async deleteByProductId(@Param('productId', IdValidationPipe) productId: string) {
		const deleteDocs = await this.reviewService.deleteByProductId(productId);
		if (!deleteDocs) {
			throw new HttpException(REVIEWS_NOT_FOUND, HttpStatus.NOT_FOUND)
		}
	}

	@UseGuards(JWTAuthGuard)
	@Get('byProduct/:productId')
	async getByProduct(@Param('productId') productId: string, @UserEmail() email: string) {
		return this.reviewService.findByProductId(productId);
	}
}

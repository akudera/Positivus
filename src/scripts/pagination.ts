import "@/styles/blocks/review.scss";
import type { TSelectors } from "../types";

type TStep = "next" | "previous";

class Pagination {
	private buttonNext: HTMLButtonElement | null;
	private buttonPrevious: HTMLButtonElement | null;
	private paginationList: HTMLElement | null;
	private paginationListElements: HTMLElement[];
	private reviewList: HTMLElement | null;
	private reviewListElements?: HTMLElement[];

	private selectors: TSelectors = {
		buttonNext: "[data-button-next]",
		buttonPrevious: "[data-button-previous]",

		selectedClassName: "selected",
		inactiveClassName: "inactive",

		reviewListId: "review-list",
		paginationListId: "pagination-list",
	} as const;

	private currentReviewElementIndex: number;

	constructor() {
		this.buttonNext = document.querySelector(this.selectors.buttonNext);
		this.buttonPrevious = document.querySelector(this.selectors.buttonPrevious);
		this.paginationList = document.getElementById(this.selectors.paginationListId);
		this.paginationListElements = Array.from(
			(this.paginationList?.children as HTMLCollectionOf<HTMLElement>) || [],
		);
		this.reviewList = document.getElementById(this.selectors.reviewListId);
		this.reviewListElements = Array.from(
			(this.reviewList?.children as HTMLCollectionOf<HTMLElement>) || [],
		);
		this.currentReviewElementIndex = 0;

		if (this.paginationListElements.length > 0) {
			this.setStates(this.paginationListElements[0].children[0] as HTMLButtonElement);
		}
		this.bindEvents();
	}

	private bindEvents(): void {
		this.paginationList?.addEventListener("click", (event) => {
			this.onPaginationButtonClick(event);
		});
		this.buttonNext?.addEventListener("click", () => {
			this.onStepButtonClick("next");
		});
		this.buttonPrevious?.addEventListener("click", () => {
			this.onStepButtonClick("previous");
		});
	}

	private setActivePaginationButton(target: HTMLButtonElement): void {
		this.paginationList?.querySelectorAll("button")?.forEach((element) => {
			element.classList.remove(this.selectors.selectedClassName);
			element.ariaDisabled = "false";
		});
		target.classList.add(this.selectors.selectedClassName);
		target.ariaDisabled = "true";
	}

	private onPaginationButtonClick(event: Event): void {
		const target = event.target as HTMLElement;

		const clickedButton = target.closest("button");
		if (!clickedButton || !this.paginationList) return;

		const allPaginationButtons = Array.from(this.paginationList.querySelectorAll("button"));

		if (allPaginationButtons.length > 0) {
			const index = allPaginationButtons.indexOf(clickedButton);
			if (index !== -1) {
				this.setStates(clickedButton, index);
			}
		}
	}

	private setActiveButton(): void {
		if (this.paginationListElements) {
			const paginationList = this.paginationListElements;

			if (this.buttonPrevious) {
				if (this.currentReviewElementIndex > 0) {
					this.buttonPrevious?.classList.remove(this.selectors.inactiveClassName);
					this.buttonPrevious.ariaDisabled = "false";
				} else {
					this.buttonPrevious?.classList.add(this.selectors.inactiveClassName);
					this.buttonPrevious.ariaDisabled = "true";
				}
			}
			if (this.buttonNext) {
				if (this.currentReviewElementIndex < paginationList.length - 1) {
					this.buttonNext.classList.remove(this.selectors.inactiveClassName);
					this.buttonNext.ariaDisabled = "false";
				} else {
					this.buttonNext.classList.add(this.selectors.inactiveClassName);
					this.buttonNext.ariaDisabled = "true";
				}
			}
		}
	}

	private setStates(target: HTMLButtonElement, index?: number): void {
		this.setReview(index);
		this.setActivePaginationButton(target);
		this.setActiveButton();
	}

	private onStepButtonClick(step: TStep): void {
		if (this.paginationListElements) {
			const paginationList = this.paginationListElements;

			if (step === "next" && this.currentReviewElementIndex + 1 < paginationList.length) {
				this.currentReviewElementIndex += 1;
			} else if (step === "previous" && this.currentReviewElementIndex > 0) {
				this.currentReviewElementIndex -= 1;
			} else return;

			this.setStates(
				paginationList[this.currentReviewElementIndex]?.children[0] as HTMLButtonElement,
				this.currentReviewElementIndex,
			);
		}
	}

	private setReview(index?: number): void {
		if (this.reviewListElements) {
			const elementScrollTo = this.reviewListElements[index || 0];

			elementScrollTo.scrollIntoView({
				behavior: "smooth",
				inline: "center",
			});
			this.currentReviewElementIndex = index || 0;
		}
	}
}

export default Pagination;

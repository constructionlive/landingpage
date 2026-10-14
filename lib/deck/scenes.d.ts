export type DeckController = {
	start: (kind: string) => void;
	setPhase: (i: number) => void;
	restart: () => void;
	resize: () => void;
	play: () => void;
	pause: () => void;
	destroy: () => void;
	current: () => string | null;
};
export function createDeck(
	THREE: unknown,
	opts: {
		canvas: HTMLCanvasElement;
		labels: HTMLElement;
		reduceMotion?: boolean;
		maxPixelRatio?: number;
	},
): DeckController;

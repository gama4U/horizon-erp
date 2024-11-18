import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';

type AnimatedDivProps = {
	children?: React.ReactNode;
	animationType?:
	| 'FadeIn'
	| 'FadeOut'
	| 'FadeInFromLeft'
	| 'FadeInFromRight'
	| 'FadeInFromUp'
	| 'FadeInFromDown'
	| 'Bubble'
	| 'SlideInFromLeft'
	| 'SlideInFromRight'
	| 'SlideInFromUp'
	| 'SlideInFromDown'
	| 'Glowing'
	| 'CardSpin'
	| 'Float'
	| 'Shake'
	| 'Approve'
	| '';
	delay?: number;
	duration?: number;
	className?: string;
	scale?: number;
	opacity?: number;
	repeatDelay?: number;
	spin?: boolean;
	slideEntrancePoint?: number;
	onClick?: () => void;
};

const AnimatedDiv = forwardRef<HTMLDivElement, AnimatedDivProps>(
	(
		{
			children,
			animationType,
			delay = 0,
			duration = 0.5,
			className,
			scale = 1.1,
			opacity = 0,
			spin = false,
			repeatDelay = 2,
			slideEntrancePoint = -100,
			onClick,
		}: AnimatedDivProps,
		ref
	) => {

		const getVariants = (): { hidden: object; visible: object } => {
			switch (animationType) {
				case 'FadeInFromLeft':
					return { hidden: { opacity, x: -100 }, visible: { opacity: 1, x: 0, transition: { duration, delay } } };
				case 'FadeInFromRight':
					return { hidden: { opacity, x: 100 }, visible: { opacity: 1, x: 0, transition: { duration, delay } } };
				case 'FadeInFromUp':
					return { hidden: { opacity, y: -100 }, visible: { opacity: 1, y: 0, transition: { duration, delay } } };
				case 'FadeInFromDown':
					return { hidden: { opacity, y: 100 }, visible: { opacity: 1, y: 0, transition: { duration, delay } } };
				case 'SlideInFromLeft':
					return {
						hidden: { x: slideEntrancePoint },
						visible: { x: 0, transition: { duration, delay } }
					};
				case 'SlideInFromRight':
					return {
						hidden: { x: 100 },
						visible: { x: 0, transition: { duration, delay } }
					};
				case 'SlideInFromUp':
					return {
						hidden: { y: slideEntrancePoint },
						visible: { y: 0, transition: { duration, delay } }
					};
				case 'SlideInFromDown':
					return {
						hidden: { y: 100 },
						visible: { y: 0, transition: { duration, delay } }
					};
				case 'FadeIn':
					return { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration, delay } } };
				case 'FadeOut':
					return { hidden: { opacity: 1 }, visible: { opacity: 0, transition: { duration, delay } } };
				case 'CardSpin':
					return {
						hidden: { opacity, rotateY: 0 },
						visible: {
							opacity: 1,
							rotateY: 360,
							transition: {
								duration,
								delay,
								ease: 'easeInOut'
							}
						}
					};
				case 'Float':
					return {
						hidden: { y: 0 },
						visible: {
							y: [0, -10, 0],
							transition: {
								duration,
								ease: 'easeInOut',
								repeat: Infinity,
								repeatType: 'loop',
								repeatDelay
							}
						}
					};
				case 'Shake':
					return {
						hidden: { opacity },
						visible: {
							opacity: 1,
							x: [0, -10, 10, -10, 10, -10, 10, 0],
							transition: {
								duration: duration,
								delay,
								ease: 'easeInOut'
							}
						}
					};
				case 'Approve':
					return {
						hidden: { opacity, scale: 1 },
						visible: {
							opacity: 1,
							scale: [2.5, 0.9, 0.8, 1],
							transition: {
								duration: 0.4,
								delay: delay + 0.1,
								times: [0, 0.4, 0.7, 1],
							},
							shake: {
								x: [0, -8, 8, -8, 8, 0],
								transition: {
									duration: 0.3,
									times: [0, 0.2, 0.4, 0.6, 0.8, 1],
									ease: "easeInOut"
								}
							}
						}
					};
				default:
					return { hidden: { opacity: 1 }, visible: { opacity: 1 } };
			}
		};

		const variants = getVariants();

		return animationType === 'Bubble' ? (
			<motion.div
				ref={ref}
				onClick={onClick}
				whileHover={{ scale: scale ?? 1.1, borderRadius: '50%' }}
				transition={{ type: 'linear', stiffness: 300, damping: 10 }}
				className={className}
			>
				{children}
			</motion.div>
		) : animationType === 'Glowing' ? (
			<motion.div
				ref={ref}
				onClick={onClick}
				animate={{
					scale: [1, scale, 1],
					opacity: [1, 0.9, 1]
				}}
				transition={{
					duration,
					delay,
					repeatDelay,
					repeat: Infinity,
					ease: 'easeInOut'
				}}
			>
				{children}
			</motion.div>
		) : animationType === 'SlideInFromLeft' && spin ? (
			<motion.div
				ref={ref}
				onClick={onClick}
				initial="hidden"
				animate={{
					opacity: [opacity, 1],
					x: [-100, 0],
					rotate: [0, 360],
				}}
				transition={{
					x: { duration, delay },
					rotate: { repeat: delay, duration: 1, ease: 'linear' },
				}}
				className={className}
			>
				{children}
			</motion.div>
		) : (
			<motion.div
				ref={ref}
				onClick={onClick}
				initial="hidden"
				animate="visible"
				variants={variants}
				className={className}
			>
				{children}
			</motion.div>
		);
	}
);

AnimatedDiv.displayName = 'AnimatedDiv';

export default AnimatedDiv;

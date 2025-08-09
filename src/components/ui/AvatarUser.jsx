// // // src/components/ui/AvatarUser.jsx
// // import { Avatar, AvatarImage, AvatarFallback } from './avatar';
// // import {useUserColors} from "../../hooks/useUserColors.js";
// //
// // /**
// //  * Componente Avatar con colores dinámicos y efectos glassmórficos
// //  * @param {Object} props
// //  * @param {Object} props.user - Objeto usuario con first_name, last_name, email, avatar
// //  * @param {string} props.size - Tamaño del avatar: 'sm' | 'md' | 'lg' | 'xl' | 'custom'
// //  * @param {string} props.className - Clases CSS adicionales
// //  * @param {boolean} props.showOnlineIndicator - Mostrar indicador de estado online
// //  * @param {boolean} props.showParticles - Mostrar partículas decorativas
// //  * @returns {JSX.Element}
// //  */
// // const AvatarUser = ({
// //                         user,
// //                         size = 'lg',
// //                         className = '',
// //                         showOnlineIndicator = true,
// //                         showParticles = true,
// //                         ...props
// //                     }) => {
// //     const colors = useUserColors(user?.email);
// //
// //     const getInitials = () => {
// //         if (user?.first_name && user?.last_name) {
// //             return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
// //         }
// //         return user?.email?.[0]?.toUpperCase() || 'U';
// //     };
// //
// //     // Configuración de tamaños responsivos
// //     const sizeConfig = {
// //         sm: {
// //             avatar: 'size-12 sm:size-16',
// //             text: 'text-lg sm:text-xl',
// //             indicator: 'w-3 h-3',
// //             particles: { base: 'w-1 h-1', small: 'w-1 h-1' }
// //         },
// //         md: {
// //             avatar: 'size-16 sm:size-20 md:size-24',
// //             text: 'text-xl sm:text-2xl md:text-3xl',
// //             indicator: 'w-3 h-3 sm:w-4 sm:h-4',
// //             particles: { base: 'w-1.5 h-1.5', small: 'w-1 h-1' }
// //         },
// //         lg: {
// //             avatar: 'size-20 sm:size-24 md:size-32 lg:size-40',
// //             text: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
// //             indicator: 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6',
// //             particles: { base: 'w-2 h-2', small: 'w-1.5 h-1.5' }
// //         },
// //         xl: {
// //             avatar: 'size-28 sm:size-32 md:size-40 lg:size-48 xl:size-56',
// //             text: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
// //             indicator: 'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7',
// //             particles: { base: 'w-2 h-2', small: 'w-1.5 h-1.5' }
// //         },
// //         custom: {
// //             avatar: '',
// //             text: '',
// //             indicator: 'w-4 h-4',
// //             particles: { base: 'w-2 h-2', small: 'w-1.5 h-1.5' }
// //         }
// //     };
// //
// //     const config = sizeConfig[size] || sizeConfig.lg;
// //
// //     return (
// //         <div className={`relative group ${className}`} {...props}>
// //             {/* Efecto de fondo dinámico */}
// //             <div
// //                 className="absolute inset-0 rounded-full blur-2xl scale-150 animate-pulse opacity-40"
// //                 style={{
// //                     background: `radial-gradient(circle, ${colors.from}30, ${colors.via}20, ${colors.to}10)`
// //                 }}
// //             />
// //
// //             {/* Anillo exterior con gradiente personalizado */}
// //             <div className="relative">
// //                 <div
// //                     className="absolute inset-0 rounded-full opacity-60 blur-sm animate-pulse"
// //                     style={{
// //                         background: `linear-gradient(45deg, ${colors.from}, ${colors.via})`
// //                     }}
// //                 />
// //
// //                 {/* Avatar principal responsive */}
// //                 <Avatar
// //                     className={`
// //                         ${size === 'custom' ? className : config.avatar}
// //                         ring-4 ring-white/30 dark:ring-white/20
// //                         shadow-2xl transition-all duration-700 ease-out
// //                         hover:scale-105 hover:ring-white/50 dark:hover:ring-white/30
// //                         hover:shadow-3xl
// //                         relative
// //                     `}
// //                 >
// //                     <AvatarImage
// //                         src={user?.avatar}
// //                         alt={`${user?.first_name} ${user?.last_name}`}
// //                         className="transition-all duration-500"
// //                     />
// //                     <AvatarFallback
// //                         className={`
// //                             ${size === 'custom' ? '' : config.text}
// //                             font-bold relative overflow-hidden
// //                             transition-all duration-500
// //                         `}
// //                         style={{
// //                             background: `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`
// //                         }}
// //                     >
// //                         {/* Shimmer effect con colores personalizados */}
// //                         <div
// //                             className="absolute inset-0 skew-x-12 transform -translate-x-full animate-shimmer opacity-30"
// //                             style={{
// //                                 background: `linear-gradient(90deg, transparent, ${colors.to}60, transparent)`
// //                             }}
// //                         />
// //                         <span className="relative z-10 drop-shadow-sm">
// //                             {getInitials()}
// //                         </span>
// //                     </AvatarFallback>
// //                 </Avatar>
// //
// //                 {/* Indicador de estado online */}
// //                 {showOnlineIndicator && (
// //                     <div className={`absolute -top-1 -right-1 ${config.indicator}`}>
// //                         <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
// //                         <div className="relative w-full h-full bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg" />
// //                     </div>
// //                 )}
// //
// //                 {/* Partículas decorativas sutiles */}
// //                 {showParticles && (
// //                     <div className="absolute inset-0 pointer-events-none opacity-60">
// //                         <div
// //                             className={`absolute -top-2 -left-2 ${config.particles.base} rounded-full animate-pulse`}
// //                             style={{ backgroundColor: colors.from }}
// //                         />
// //                         <div
// //                             className={`absolute -bottom-2 -right-8 ${config.particles.small} rounded-full animate-pulse delay-700`}
// //                             style={{ backgroundColor: colors.via }}
// //                         />
// //                         <div
// //                             className={`absolute -top-4 -right-4 ${config.particles.small} rounded-full animate-pulse delay-300`}
// //                             style={{ backgroundColor: colors.to }}
// //                         />
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default AvatarUser;
//
// // src/components/ui/AvatarUser.jsx
// import { Avatar, AvatarImage, AvatarFallback } from './avatar';
// import { useUserColors } from '../../hooks/useUserColors';
//
// /**
//  * Componente Avatar con colores dinámicos y efectos glassmórficos
//  * @param {Object} props
//  * @param {Object} props.user - Objeto usuario con first_name, last_name, email, avatar
//  * @param {string} props.size - Tamaño del avatar: 'sm' | 'md' | 'lg' | 'xl' | 'custom'
//  * @param {string} props.className - Clases CSS adicionales
//  * @param {boolean} props.showOnlineIndicator - Mostrar indicador de estado online
//  * @param {boolean} props.showParticles - Mostrar partículas decorativas
//  * @returns {JSX.Element}
//  */
// const AvatarUser = ({
//     user,
//     size = 'lg',
//     className = '',
//     showOnlineIndicator = true,
//     showParticles = true,
//     ...props
// }) => {
//     const colors = useUserColors(user?.email);
//
//     const getInitials = () => {
//         if (user?.first_name && user?.last_name) {
//             return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
//         }
//         return user?.email?.[0]?.toUpperCase() || 'U';
//     };
//
//     // Configuración de tamaños responsivos
//     const sizeConfig = {
//         sm: {
//             avatar: 'size-12 sm:size-16',
//             text: 'text-lg sm:text-xl',
//             indicator: 'w-3 h-3',
//             particles: { base: 'w-1 h-1', small: 'w-1 h-1' }
//         },
//         md: {
//             avatar: 'size-16 sm:size-20 md:size-24',
//             text: 'text-xl sm:text-2xl md:text-3xl',
//             indicator: 'w-3 h-3 sm:w-4 sm:h-4',
//             particles: { base: 'w-1.5 h-1.5', small: 'w-1 h-1' }
//         },
//         lg: {
//             avatar: 'size-20 sm:size-24 md:size-32 lg:size-40',
//             text: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
//             indicator: 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6',
//             particles: { base: 'w-2 h-2', small: 'w-1.5 h-1.5' }
//         },
//         xl: {
//             avatar: 'size-36 sm:size-40 md:size-44 lg:size-48 xl:size-56',
//             text: 'text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
//             indicator: 'w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7',
//             particles: { base: 'w-2 h-2', small: 'w-1.5 h-1.5' }
//         },
//         '2xl': {
//             avatar: 'size-32 sm:size-40 md:size-48 lg:size-56 xl:size-64',
//             text: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
//             indicator: 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8',
//             particles: { base: 'w-2.5 h-2.5', small: 'w-2 h-2' }
//         },
//         custom: {
//             avatar: '',
//             text: '',
//             indicator: 'w-4 h-4',
//             particles: { base: 'w-2 h-2', small: 'w-1.5 h-1.5' }
//         }
//     };
//
//     const config = sizeConfig[size] || sizeConfig.lg;
//
//     return (
//         <div className={`relative group ${className}`} {...props}>
//             {/* Efecto de fondo dinámico */}
//             <div
//                 className="absolute inset-0 rounded-full blur-2xl scale-150 animate-pulse opacity-40"
//                 style={{
//                     background: `radial-gradient(circle, ${colors.from}30, ${colors.via}20, ${colors.to}10)`
//                 }}
//             />
//
//             {/* Anillo exterior con gradiente personalizado */}
//             <div className="relative">
//                 <div
//                     className="absolute inset-0 rounded-full opacity-60 blur-sm animate-pulse"
//                     style={{
//                         background: `linear-gradient(45deg, ${colors.from}, ${colors.via})`
//                     }}
//                 />
//
//                 {/* Avatar principal responsive */}
//                 <Avatar
//                     className={`
//                         ${size === 'custom' ? className : config.avatar}
//                         ring-4 ring-white/30 dark:ring-white/20
//                         shadow-2xl transition-all duration-700 ease-out
//                         hover:scale-105 hover:ring-white/50 dark:hover:ring-white/30
//                         hover:shadow-3xl
//                         relative
//                     `}
//                 >
//                     <AvatarImage
//                         src={user?.avatar}
//                         alt={`${user?.first_name} ${user?.last_name}`}
//                         className="transition-all duration-500"
//                     />
//                     <AvatarFallback
//                         className={`
//                             ${size === 'custom' ? '' : config.text}
//                             font-bold relative overflow-hidden
//                             transition-all duration-500
//                         `}
//                         style={{
//                             background: `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`
//                         }}
//                     >
//                         {/* Shimmer effect con colores personalizados */}
//                         <div
//                             className="absolute inset-0 skew-x-12 transform -translate-x-full animate-shimmer opacity-30"
//                             style={{
//                                 background: `linear-gradient(90deg, transparent, ${colors.to}60, transparent)`
//                             }}
//                         />
//                         <span className="relative z-10 drop-shadow-sm">
//                             {getInitials()}
//                         </span>
//                     </AvatarFallback>
//                 </Avatar>
//
//                 {/* Indicador de estado online */}
//                 {showOnlineIndicator && (
//                     <div className={`absolute -top-1 -right-1 ${config.indicator}`}>
//                         <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
//                         <div className="relative w-full h-full bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg" />
//                     </div>
//                 )}
//
//                 {/* Partículas decorativas sutiles */}
//                 {showParticles && (
//                     <div className="absolute inset-0 pointer-events-none opacity-60">
//                         <div
//                             className={`absolute -top-2 -left-2 ${config.particles.base} rounded-full animate-pulse`}
//                             style={{ backgroundColor: colors.from }}
//                         />
//                         <div
//                             className={`absolute -bottom-2 -right-8 ${config.particles.small} rounded-full animate-pulse delay-700`}
//                             style={{ backgroundColor: colors.via }}
//                         />
//                         <div
//                             className={`absolute -top-4 -right-4 ${config.particles.small} rounded-full animate-pulse delay-300`}
//                             style={{ backgroundColor: colors.to }}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default AvatarUser;


// src/components/ui/AvatarUser.jsx
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { useUserColors } from '../../hooks/useUserColors';

/**
 * Componente Avatar con colores dinámicos y efectos glassmórficos
 * @param {Object} props
 * @param {Object} props.user - Objeto usuario con first_name, last_name, email, avatar
 * @param {string} props.size - Tamaño del avatar: 'sm' | 'md' | 'lg' | 'xl' | 'custom'
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.showOnlineIndicator - Mostrar indicador de estado online
 * @param {boolean} props.showParticles - Mostrar partículas decorativas
 * @returns {JSX.Element}
 */
const AvatarUser = ({
    user,
    size = 'lg',
    className = '',
    showOnlineIndicator = true,
    showParticles = true,
    ...props
}) => {
    const colors = useUserColors(user?.email);

    const getInitials = () => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user?.email?.[0]?.toUpperCase() || 'U';
    };

    // Configuración de tamaños responsivos
    const sizeConfig = {
        sm: {
            avatar: 'size-12 sm:size-16',
            text: 'text-lg sm:text-xl',
            indicator: 'w-3 h-3',
            particles: { base: 'w-1 h-1', small: 'w-1 h-1' }
        },
        md: {
            avatar: 'size-16 sm:size-20 md:size-24',
            text: 'text-xl sm:text-2xl md:text-3xl',
            indicator: 'w-3 h-3 sm:w-4 sm:h-4',
            particles: { base: 'w-1.5 h-1.5', small: 'w-1 h-1' }
        },
        lg: {
            avatar: 'size-20 sm:size-24 md:size-32 lg:size-40',
            text: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
            indicator: 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6',
            particles: { base: 'w-2 h-2', small: 'w-1.5 h-1.5' }
        },
        xl: {
            avatar: 'size-40 sm:size-44 md:size-48 lg:size-52 xl:size-56',
            text: 'text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl',
            indicator: 'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7',
            particles: { base: 'w-2 h-2', small: 'w-1.5 h-1.5' }
        },
        '2xl': {
            avatar: 'size-32 sm:size-40 md:size-48 lg:size-56 xl:size-64',
            text: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
            indicator: 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8',
            particles: { base: 'w-2.5 h-2.5', small: 'w-2 h-2' }
        },
        custom: {
            avatar: '',
            text: '',
            indicator: 'w-4 h-4',
            particles: { base: 'w-2 h-2', small: 'w-1.5 h-1.5' }
        }
    };

    const config = sizeConfig[size] || sizeConfig.lg;

    return (
        <div className={`relative group ${className}`} {...props}>
            {/* Efecto de fondo dinámico */}
            <div
                className="absolute inset-0 rounded-full blur-2xl scale-150 animate-pulse opacity-40"
                style={{
                    background: `radial-gradient(circle, ${colors.from}30, ${colors.via}20, ${colors.to}10)`
                }}
            />

            {/* Anillo exterior con gradiente personalizado */}
            <div className="relative">
                <div
                    className="absolute inset-0 rounded-full opacity-60 blur-sm animate-pulse"
                    style={{
                        background: `linear-gradient(45deg, ${colors.from}, ${colors.via})`
                    }}
                />

                {/* Avatar principal responsive */}
                <Avatar
                    className={`
                        ${size === 'custom' ? className : config.avatar}
                        ring-4 ring-white/30 dark:ring-white/20
                        shadow-2xl transition-all duration-700 ease-out
                        hover:scale-105 hover:ring-white/50 dark:hover:ring-white/30
                        hover:shadow-3xl
                        relative
                    `}
                >
                    <AvatarImage
                        src={user?.avatar}
                        alt={`${user?.first_name} ${user?.last_name}`}
                        className="transition-all duration-500"
                    />
                    <AvatarFallback
                        className={`
                            ${size === 'custom' ? '' : config.text}
                            font-bold relative overflow-hidden
                            transition-all duration-500
                        `}
                        style={{
                            background: `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`
                        }}
                    >
                        {/* Shimmer effect con colores personalizados */}
                        <div
                            className="absolute inset-0 skew-x-12 transform -translate-x-full animate-shimmer opacity-30"
                            style={{
                                background: `linear-gradient(90deg, transparent, ${colors.to}60, transparent)`
                            }}
                        />
                        <span className="relative z-10 drop-shadow-sm">
                            {getInitials()}
                        </span>
                    </AvatarFallback>
                </Avatar>

                {/* Indicador de estado online */}
                {showOnlineIndicator && (
                    <div className={`absolute -top-0.5 -right-0.5 ${config.indicator}`}>
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                        <div className="relative w-full h-full bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg" />
                    </div>
                )}

                {/* Partículas decorativas sutiles */}
                {showParticles && (
                    <div className="absolute inset-0 pointer-events-none opacity-60">
                        <div
                            className={`absolute -top-2 -left-2 ${config.particles.base} rounded-full animate-pulse`}
                            style={{ backgroundColor: colors.from }}
                        />
                        <div
                            className={`absolute -bottom-2 -right-8 ${config.particles.small} rounded-full animate-pulse delay-700`}
                            style={{ backgroundColor: colors.via }}
                        />
                        <div
                            className={`absolute -top-4 -right-4 ${config.particles.small} rounded-full animate-pulse delay-300`}
                            style={{ backgroundColor: colors.to }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvatarUser;
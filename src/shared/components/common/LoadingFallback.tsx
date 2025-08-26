const LoadingFallback = () => {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-fire-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Carregando experiência...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
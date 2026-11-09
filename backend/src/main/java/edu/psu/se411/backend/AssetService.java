package edu.psu.se411.backend;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AssetService {

	private final AssetRepository repository;

	public AssetService(AssetRepository repository) {
		this.repository = repository;
	}

	public Asset create(Asset asset) {
		asset.setId(null);
		return repository.save(asset);
	}

	public Asset get(Long id) {
		return repository.findById(id).orElseThrow(() -> new AssetNotFoundException(id));
	}

	public Page<Asset> list(Pageable pageable) {
		return repository.findAll(pageable);
	}

	public Asset update(Long id, Asset asset) {
		if (!repository.existsById(id)) {
			throw new AssetNotFoundException(id);
		}
		asset.setId(id);
		return repository.save(asset);
	}

	public void delete(Long id) {
		if (!repository.existsById(id)) {
			throw new AssetNotFoundException(id);
		}
		repository.deleteById(id);
	}
}
